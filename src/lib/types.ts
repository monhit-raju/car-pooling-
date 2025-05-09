// Authentication types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'passenger' | 'driver';
}

export interface AuthResponse {
  token: string;
  user: User;
}

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'passenger' | 'driver';
  avatar?: string;
  phone?: string;
  rating?: number;
  totalRides?: number;
  verified?: boolean;
}

// Driver types
export interface Driver {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  rating: number;
  totalRides: number;
  verified: boolean;
  carDetails?: CarDetails;
}

export interface CarDetails {
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  seats: number;
}

// Ride types
export interface Ride {
  id: string;
  driver: Driver;
  from: string;
  to: string;
  departureTime: string;
  estimatedArrival: string;
  price: number;
  availableSeats: number;
  status: 'available' | 'full' | 'cancelled' | 'completed';
  description?: string;
}

// Booking types
export interface Booking {
  id: string;
  ride: Ride;
  passenger: User;
  seats: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  bookingTime: string;
  totalPrice: number;
}

export interface PassengerDetail {
  name: string;
  phone: string;
}

// Search types
export interface SearchCriteria {
  from?: string;
  to?: string;
  date?: Date;
  seats?: number;
}
