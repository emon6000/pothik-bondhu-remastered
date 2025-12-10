
import pool from './db.js';

const initDb = async () => {
  const client = await pool.connect();
  try {
    console.log('Initializing database tables...');

    // 1. Create Users Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        photo TEXT,
        phone TEXT,
        district TEXT,
        location TEXT,
        experience_start_date TEXT,
        languages TEXT[],
        is_available BOOLEAN DEFAULT true,
        rating FLOAT DEFAULT 5.0,
        rating_count INTEGER DEFAULT 0
      );
    `);
    console.log('Checked/Created "users" table.');

    // 2. Create Bookings Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        guide_id INTEGER REFERENCES users(id),
        trip_start TEXT,
        trip_end TEXT,
        booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'pending',
        is_rated BOOLEAN DEFAULT false,
        user_rating FLOAT,
        user_review TEXT
      );
    `);
    console.log('Checked/Created "bookings" table.');

    console.log('Database initialization successful!');
  } catch (err) {
    console.error('Error initializing database:', err);
  } finally {
    client.release();
    pool.end(); // Close connection
  }
};

initDb();
