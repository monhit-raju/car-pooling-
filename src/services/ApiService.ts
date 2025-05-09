import axios from 'axios';
import { LoginCredentials, RegisterData, Ride, User, Booking, PassengerDetail } from '../lib/types';

const API_BASE_URL = 'http://localhost:8000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem('elitecars_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('elitecars_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const ApiService = {
  // Authentication methods
  async login(credentials: LoginCredentials) {
    try {
      const response = await api.post('/users/login', credentials);
      
      // Store token and user data in localStorage
      localStorage.setItem('elitecars_token', response.data.token);
      localStorage.setItem('elitecars_current_user', JSON.stringify(response.data.user));
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.detail || 'Login failed');
      }
      throw new Error('Network error occurred');
    }
  },
  
  async register(userData: RegisterData) {
    try {
      const response = await api.post('/users/register', userData);
      
      // Store token and user data in localStorage
      localStorage.setItem('elitecars_token', response.data.token);
      localStorage.setItem('elitecars_current_user', JSON.stringify(response.data.user));
      
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.detail || 'Registration failed');
      }
      throw new Error('Network error occurred');
    }
  },
  
  logout() {
    // Clear authentication data from localStorage
    localStorage.removeItem('elitecars_token');
    localStorage.removeItem('elitecars_current_user');
  },
  
  // User profile methods
  async getUserProfile() {
    try {
      const response = await api.get('/users/profile');
      return response.data;
    } catch (error) {
      console.error('Get user profile error:', error);
      return { name: "Team ELITE TN", email: "team@elite.com", role: "passenger" };
    }
  },
  
  // Add other methods as needed
};

export default ApiService;
