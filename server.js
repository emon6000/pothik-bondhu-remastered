
import express from 'express';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './db.js'; // Import the pg pool

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Helper to convert DB snake_case to API camelCase
const mapUser = (row) => ({
  id: row.id.toString(), // Convert ID to string for frontend compatibility
  name: row.name,
  email: row.email,
  role: row.role,
  photo: row.photo,
  phone: row.phone,
  district: row.district,
  location: row.location, // Dynamic location
  currentLocation: row.location, // Alias for frontend type compatibility
  experienceStartDate: row.experience_start_date,
  languages: row.languages || [],
  isAvailable: row.is_available,
  rating: row.rating,
  ratingCount: row.rating_count
});

// Helper for bookings
const mapBooking = (row) => ({
  id: row.id.toString(),
  userId: row.user_id.toString(),
  guideId: row.guide_id.toString(),
  guideName: row.guide_name,
  guidePhoto: row.guide_photo,
  guidePhone: row.guide_phone,
  guideEmail: row.guide_email,
  tripStart: row.trip_start,
  tripEnd: row.trip_end,
  bookingDate: row.booking_date,
  status: row.status,
  isRated: row.is_rated,
  userRating: row.user_rating,
  userReview: row.user_review
});

// Helper for experience calculation
function calculateExperience(dateString) {
    if (!dateString) return 'New';
    const diff = Date.now() - new Date(dateString).getTime();
    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
    return years > 0 ? `${years} Years` : 'New';
}

// --- API ROUTES ---

// 1. Register
app.post('/api/auth/register', async (req, res) => {
  const client = await pool.connect();
  try {
    const { name, email, password, role, phone, district, location, experienceStartDate, languages } = req.body;
    
    // Check existing
    const check = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    if (check.rows.length > 0) return res.status(400).json({ error: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const photo = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=128`;

    const result = await client.query(
      `INSERT INTO users (name, email, password, role, photo, phone, district, location, experience_start_date, languages, is_available)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [name, email, hashedPassword, role, photo, phone, district, location, experienceStartDate, languages, true]
    );

    res.json(mapUser(result.rows[0]));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Registration failed' });
  } finally {
    client.release();
  }
});

// 2. Login
app.post('/api/auth/login', async (req, res) => {
  const client = await pool.connect();
  try {
    const { email, password } = req.body;
    const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json(mapUser(user));
  } catch (e) {
    res.status(500).json({ error: 'Login failed' });
  } finally {
    client.release();
  }
});

// 3. Get Guides
app.get('/api/guides', async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT * FROM users WHERE role = 'guide'");
    
    const formattedGuides = result.rows.map(row => {
        const u = mapUser(row);
        return {
            ...u,
            experience: calculateExperience(u.experienceStartDate)
        };
    });

    res.json(formattedGuides);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch guides' });
  } finally {
    client.release();
  }
});

// 4. Create Booking
app.post('/api/bookings', async (req, res) => {
  const client = await pool.connect();
  try {
    const { userId, guideId, tripStart, tripEnd } = req.body;

    const result = await client.query(
      `INSERT INTO bookings (user_id, guide_id, trip_start, trip_end, status)
       VALUES ($1, $2, $3, $4, 'pending') RETURNING *`,
      [userId, guideId, tripStart, tripEnd]
    );
    
    const booking = result.rows[0];
    
    // Fetch guide details to return complete booking object
    const guideRes = await client.query('SELECT name, photo, phone, email FROM users WHERE id = $1', [guideId]);
    const guide = guideRes.rows[0];

    const response = {
        ...mapBooking(booking),
        guideName: guide.name,
        guidePhoto: guide.photo,
        guidePhone: guide.phone,
        guideEmail: guide.email
    };

    res.json(response);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Booking failed' });
  } finally {
    client.release();
  }
});

// 5. Get Bookings by User
app.get('/api/bookings/user/:userId', async (req, res) => {
  const client = await pool.connect();
  try {
    // Join with users table to get guide details
    const result = await client.query(`
        SELECT b.*, u.name as guide_name, u.photo as guide_photo, u.phone as guide_phone, u.email as guide_email 
        FROM bookings b 
        JOIN users u ON b.guide_id = u.id 
        WHERE b.user_id = $1 
        ORDER BY b.booking_date DESC
    `, [req.params.userId]);
    
    res.json(result.rows.map(mapBooking));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  } finally {
    client.release();
  }
});

// 6. Get Bookings by Guide
app.get('/api/bookings/guide/:guideId', async (req, res) => {
    const client = await pool.connect();
    try {
        // We might want user details here too, but reusing mapBooking structure
        const result = await client.query(`
            SELECT b.* 
            FROM bookings b 
            WHERE b.guide_id = $1 
            ORDER BY b.booking_date DESC
        `, [req.params.guideId]);
        
        // Populate generic "Me" or handle distinct mapping if Traveler details needed
        const bookings = result.rows.map(row => ({
            ...mapBooking(row),
            guideName: "Me", 
        }));
    
        res.json(bookings);
    } catch (e) {
      res.status(500).json({ error: 'Failed to fetch jobs' });
    } finally {
      client.release();
    }
});

// 7. Accept Booking
app.post('/api/bookings/:id/accept', async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        // Update booking
        const bRes = await client.query(
            "UPDATE bookings SET status = 'active' WHERE id = $1 RETURNING *", 
            [req.params.id]
        );
        
        if(bRes.rows.length === 0) throw new Error("Booking not found");
        const booking = bRes.rows[0];

        // Update Guide status
        await client.query(
            "UPDATE users SET is_available = false WHERE id = $1", 
            [booking.guide_id]
        );

        await client.query('COMMIT');
        res.json(mapBooking(booking));
    } catch (e) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: 'Failed to accept' });
    } finally {
        client.release();
    }
});

// 8. Reject Booking
app.post('/api/bookings/:id/reject', async (req, res) => {
    const client = await pool.connect();
    try {
        const result = await client.query(
            "UPDATE bookings SET status = 'rejected' WHERE id = $1 RETURNING *", 
            [req.params.id]
        );
        res.json(mapBooking(result.rows[0]));
    } catch (e) {
        res.status(500).json({ error: 'Failed to reject' });
    } finally {
        client.release();
    }
});

// 9. Cancel Booking
app.post('/api/bookings/:id/cancel', async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const check = await client.query("SELECT * FROM bookings WHERE id = $1", [req.params.id]);
        if(check.rows.length === 0) {
             await client.query('ROLLBACK');
             return res.status(404).json({error: 'Not found'});
        }
        const booking = check.rows[0];
        const wasActive = booking.status === 'active';

        const updated = await client.query(
            "UPDATE bookings SET status = 'cancelled' WHERE id = $1 RETURNING *",
            [req.params.id]
        );

        if(wasActive) {
            await client.query(
                "UPDATE users SET is_available = true WHERE id = $1",
                [booking.guide_id]
            );
        }

        await client.query('COMMIT');
        res.json(mapBooking(updated.rows[0]));
    } catch (e) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: 'Failed to cancel' });
    } finally {
        client.release();
    }
});

// 10. Complete Booking
app.post('/api/bookings/:id/complete', async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const bRes = await client.query(
            "UPDATE bookings SET status = 'completed' WHERE id = $1 RETURNING *",
            [req.params.id]
        );
        const booking = bRes.rows[0];

        await client.query(
            "UPDATE users SET is_available = true WHERE id = $1",
            [booking.guide_id]
        );

        await client.query('COMMIT');
        res.json(mapBooking(booking));
    } catch (e) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: 'Update failed' });
    } finally {
        client.release();
    }
});

// 11. Rate Booking
app.post('/api/bookings/:id/rate', async (req, res) => {
    const client = await pool.connect();
    try {
        const { rating, review } = req.body;
        const bookingId = req.params.id;

        await client.query('BEGIN');

        // Check if rated
        const check = await client.query("SELECT * FROM bookings WHERE id = $1", [bookingId]);
        if (check.rows.length === 0 || check.rows[0].is_rated) {
            await client.query('ROLLBACK');
            return res.status(400).json({error: "Already rated or not found"});
        }
        const booking = check.rows[0];

        // Update Booking
        await client.query(
            "UPDATE bookings SET is_rated = true, user_rating = $1, user_review = $2 WHERE id = $3",
            [rating, review, bookingId]
        );

        // Calculate new rating
        const guideRes = await client.query("SELECT rating, rating_count FROM users WHERE id = $1", [booking.guide_id]);
        const guide = guideRes.rows[0];
        
        const currentRating = guide.rating || 5.0;
        const currentCount = guide.rating_count || 0;
        const newCount = currentCount + 1;
        
        // Weighted average calculation
        let newRating = ((currentRating * currentCount) + rating) / newCount;
        newRating = Math.min(5, Math.max(0, newRating));
        newRating = Math.round(newRating * 10) / 10;

        await client.query(
            "UPDATE users SET rating = $1, rating_count = $2 WHERE id = $3",
            [newRating, newCount, booking.guide_id]
        );

        await client.query('COMMIT');
        res.json({ success: true });
    } catch (e) {
        await client.query('ROLLBACK');
        console.error(e);
        res.status(500).json({ error: 'Rating failed' });
    } finally {
        client.release();
    }
});

// --- SERVE FRONTEND ---
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
