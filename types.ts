
export interface District {
  name: string;
  bnName: string;
  aliases: string[];
  division: string;
  famousFoods: string[];
  placesOfInterest: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface Guide {
  id: string;
  name: string;
  phone: string;
  email: string;
  photo: string;
  location: string; // Current location (Dynamic)
  district: string; // Home district (Static/Registration)
  rating: number; 
  ratingCount: number; 
  experience: string; 
  languages: string[];
  isSystemGenerated?: boolean;
  isAvailable: boolean; 
}

export type UserRole = 'traveler' | 'guide';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  // Guide specific fields
  phone?: string;
  district?: string; // Home district
  currentLocation?: string; // Current Location for guides
  experienceStartDate?: string;
  languages?: string[];
  isAvailable?: boolean; // For guide users
  rating?: number;
  ratingCount?: number;
}

export interface Booking {
  id: string;
  userId: string;
  guideId: string;
  guideName: string;
  guidePhoto: string;
  guidePhone: string;
  guideEmail: string;
  tripStart: string;
  tripEnd: string;
  bookingDate: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled' | 'rejected';
  isRated: boolean;
  userRating?: number;
  userReview?: string;
}

export type DivisionType = 
  | 'Barishal'
  | 'Chattogram'
  | 'Dhaka'
  | 'Khulna'
  | 'Mymensingh'
  | 'Rajshahi'
  | 'Rangpur'
  | 'Sylhet';
