import { LoginCredentials, RegisterData, Ride, User, Booking, PassengerDetail, SearchCriteria } from './types';

const API_BASE_URL = 'http://localhost:8000';

// Helper function to get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem('elitecars_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const ApiService = {
    // Authentication methods
    async login(credentials: LoginCredentials) {
        try {
            const response = await fetch(`${API_BASE_URL}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Login failed');
            }
            
            const data = await response.json();
            
            // Store token and user data in localStorage
            localStorage.setItem('elitecars_token', data.token);
            localStorage.setItem('elitecars_current_user', JSON.stringify(data.user));
            
            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },
    
    async register(userData: RegisterData) {
        try {
            const response = await fetch(`${API_BASE_URL}/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Registration failed');
            }
            
            const data = await response.json();
            
            // Store token and user data in localStorage
            localStorage.setItem('elitecars_token', data.token);
            localStorage.setItem('elitecars_current_user', JSON.stringify(data.user));
            
            return data;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    },
    
    logout() {
        // Clear authentication data from localStorage
        localStorage.removeItem('elitecars_token');
        localStorage.removeItem('elitecars_current_user');
    },
    
    // User profile methods
    async getUserProfile() {
        const authHeader = getAuthHeader();
        if (!authHeader.Authorization) {
            throw new Error('Not authenticated');
        }
        
        try {
            const response = await fetch(`${API_BASE_URL}/users/profile`, {
                headers: {
                    ...authHeader
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch user profile');
            }
            
            return response.json();
        } catch (error) {
            console.error('Get user profile error:', error);
            return { name: "Team ELITE TN", email: "team@elite.com", role: "passenger" };
        }
    },
    
    async updateUserProfile(userData: Partial<User>) {
        const authHeader = getAuthHeader();
        if (!authHeader.Authorization) {
            throw new Error('Not authenticated');
        }
        
        try {
            const response = await fetch(`${API_BASE_URL}/users/profile`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    ...authHeader
                },
                body: JSON.stringify(userData)
            });
            
            if (!response.ok) {
                throw new Error('Failed to update user profile');
            }
            
            return response.json();
        } catch (error) {
            console.error('Update user profile error:', error);
            throw error;
        }
    },
    
    // Ride methods
    async getRides(criteria?: SearchCriteria) {
        let url = `${API_BASE_URL}/rides`;
        
        if (criteria) {
            const params = new URLSearchParams();
            if (criteria.from) params.append('from', criteria.from);
            if (criteria.to) params.append('to', criteria.to);
            if (criteria.date) params.append('date', criteria.date.toISOString().split('T')[0]);
            if (criteria.seats) params.append('seats', criteria.seats.toString());
            
            url += `?${params.toString()}`;
        }
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch rides');
            }
            return response.json();
        } catch (error) {
            console.error('Get rides error:', error);
            // Return mock data for development
            return [
                {
                    id: '1',
                    driver: {
                        id: 'd1',
                        name: 'John Driver',
                        email: 'john@example.com',
                        rating: 4.8,
                        totalRides: 120,
                        verified: true,
                        avatar: 'https://ui-avatars.com/api/?name=John+Driver'
                    },
                    from: 'New York',
                    to: 'Boston',
                    departureTime: new Date().toISOString(),
                    estimatedArrival: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
                    price: 45,
                    availableSeats: 3,
                    status: 'available'
                },
                {
                    id: '2',
                    driver: {
                        id: 'd2',
                        name: 'Sarah Driver',
                        email: 'sarah@example.com',
                        rating: 4.9,
                        totalRides: 85,
                        verified: true,
                        avatar: 'https://ui-avatars.com/api/?name=Sarah+Driver'
                    },
                    from: 'Chicago',
                    to: 'Detroit',
                    departureTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
                    estimatedArrival: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
                    price: 35,
                    availableSeats: 2,
                    status: 'available'
                }
            ];
        }
    },
    
    async createRide(rideData: Partial<Ride>) {
        const authHeader = getAuthHeader();
        if (!authHeader.Authorization) {
            throw new Error('Not authenticated');
        }
        
        try {
            const response = await fetch(`${API_BASE_URL}/rides`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...authHeader
                },
                body: JSON.stringify(rideData)
            });
            
            if (!response.ok) {
                throw new Error('Failed to create ride');
            }
            
            return response.json();
        } catch (error) {
            console.error('Create ride error:', error);
            throw error;
        }
    },
    
    async updateRide(rideId: string, rideData: Partial<Ride>) {
        const authHeader = getAuthHeader();
        if (!authHeader.Authorization) {
            throw new Error('Not authenticated');
        }
        
        try {
            const response = await fetch(`${API_BASE_URL}/rides/${rideId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    ...authHeader
                },
                body: JSON.stringify(rideData)
            });
            
            if (!response.ok) {
                throw new Error('Failed to update ride');
            }
            
            return response.json();
        } catch (error) {
            console.error('Update ride error:', error);
            throw error;
        }
    },
    
    // Booking methods
    async getBookings() {
        const authHeader = getAuthHeader();
        if (!authHeader.Authorization) {
            throw new Error('Not authenticated');
        }
        
        try {
            const response = await fetch(`${API_BASE_URL}/bookings`, {
                headers: {
                    ...authHeader
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch bookings');
            }
            
            return response.json();
        } catch (error) {
            console.error('Get bookings error:', error);
            return [];
        }
    },
    
    async createBooking(rideId: string, seats: number, passengerDetails?: PassengerDetail) {
        const authHeader = getAuthHeader();
        if (!authHeader.Authorization) {
            throw new Error('Not authenticated');
        }
        
        try {
            const response = await fetch(`${API_BASE_URL}/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...authHeader
                },
                body: JSON.stringify({
                    rideId,
                    seats,
                    passengerDetails
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to create booking');
            }
            
            return response.json();
        } catch (error) {
            console.error('Create booking error:', error);
            throw error;
        }
    },
    
    async getDriverBookings() {
        const authHeader = getAuthHeader();
        if (!authHeader.Authorization) {
            throw new Error('Not authenticated');
        }
        
        try {
            const response = await fetch(`${API_BASE_URL}/bookings`, {
                headers: {
                    ...authHeader
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch bookings');
            }
            
            return response.json();
        } catch (error) {
            console.error('Get driver bookings error:', error);
            throw error;
        }
    },
    
    async updateBookingStatus(bookingId: string, status: 'accepted' | 'rejected') {
        const authHeader = getAuthHeader();
        if (!authHeader.Authorization) {
            throw new Error('Not authenticated');
        }
        
        try {
            const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    ...authHeader
                },
                body: JSON.stringify({ status })
            });
            
            if (!response.ok) {
                throw new Error('Failed to update booking status');
            }
            
            return response.json();
        } catch (error) {
            console.error('Update booking status error:', error);
            throw error;
        }
    }
};

export default ApiService;
