
import { User, Guide, Booking } from '../types';

// Use relative URL for production/dev seamless integration
// If running separately, you might need http://localhost:3000
const API_URL = '/api';

export const api = {
  auth: {
    register: async (userData: any): Promise<User> => {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Registration failed');
        }
        return res.json();
    },

    login: async (creds: any): Promise<User> => {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(creds)
        });
        if (!res.ok) {
            throw new Error('Invalid email or password');
        }
        return res.json();
    },

    logout: async () => {
        // Client side only action usually
    }
  },

  guides: {
    list: async (): Promise<Guide[]> => {
        const res = await fetch(`${API_URL}/guides`);
        if (!res.ok) return [];
        return res.json();
    }
  },

  bookings: {
    create: async (data: { userId: string, guideId: string, tripStart: string, tripEnd: string }) => {
        const res = await fetch(`${API_URL}/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Booking failed');
        return res.json();
    },

    listByUser: async (userId: string): Promise<Booking[]> => {
        const res = await fetch(`${API_URL}/bookings/user/${userId}`);
        if (!res.ok) return [];
        return res.json();
    },

    listByGuide: async (guideId: string): Promise<Booking[]> => {
        const res = await fetch(`${API_URL}/bookings/guide/${guideId}`);
        if (!res.ok) return [];
        return res.json();
    },

    accept: async (bookingId: string) => {
        const res = await fetch(`${API_URL}/bookings/${bookingId}/accept`, { method: 'POST' });
        if (!res.ok) throw new Error('Failed');
        return res.json();
    },

    reject: async (bookingId: string) => {
        const res = await fetch(`${API_URL}/bookings/${bookingId}/reject`, { method: 'POST' });
        if (!res.ok) throw new Error('Failed');
        return res.json();
    },

    cancel: async (bookingId: string) => {
        const res = await fetch(`${API_URL}/bookings/${bookingId}/cancel`, { method: 'POST' });
        if (!res.ok) throw new Error('Failed');
        return res.json();
    },

    complete: async (bookingId: string) => {
        const res = await fetch(`${API_URL}/bookings/${bookingId}/complete`, { method: 'POST' });
        if (!res.ok) throw new Error('Failed');
        return res.json();
    },

    rate: async (bookingId: string, rating: number, review: string) => {
        const res = await fetch(`${API_URL}/bookings/${bookingId}/rate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rating, review })
        });
        if (!res.ok) throw new Error('Failed');
        return res.json();
    }
  }
};
