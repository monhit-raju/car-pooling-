// Auth utilities
import ApiService from './api';

export const isAuthenticated = (): boolean => {
  return localStorage.getItem('elitecars_token') !== null;
};

export const getCurrentUser = () => {
  const userJson = localStorage.getItem('elitecars_current_user');
  return userJson ? JSON.parse(userJson) : null;
};

export const login = async (email: string, password: string) => {
  try {
    const response = await ApiService.login({ email, password });
    
    // Get user role and redirect accordingly
    const user = response.user;
    return { ...response, redirectPath: determineRedirectPath(user.role) };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logout = () => {
  ApiService.logout();
  window.location.href = '/login';
};

export const requireAuth = (nextState: any, replace: any) => {
  if (!isAuthenticated()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    });
  }
};

// Helper function to determine redirect path based on user role
export const determineRedirectPath = (role: string): string => {
  switch(role) {
    case 'driver':
      return '/driver-dashboard';
    case 'passenger':
      return '/passenger-dashboard';
    case 'admin':
      return '/admin';
    default:
      return '/dashboard';
  }
};

