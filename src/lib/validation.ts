// Form validation utilities

export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};

export const validatePhone = (phone: string): boolean => {
  const re = /^\d{10}$/;
  return re.test(phone);
};

export const validateAadhaar = (aadhaar: string): boolean => {
  const re = /^\d{12}$/;
  return re.test(aadhaar);
};

export const validateRequired = (value: string): boolean => {
  return value.trim() !== '';
};

export const validateDate = (date: string): boolean => {
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selectedDate >= today;
};

export const validateTime = (time: string, date: string): boolean => {
  if (!time || !date) return false;
  
  const [hours, minutes] = time.split(':').map(Number);
  const selectedDate = new Date(date);
  selectedDate.setHours(hours, minutes, 0, 0);
  
  const now = new Date();
  return selectedDate > now;
};

export const validatePrice = (price: string): boolean => {
  const numPrice = Number(price);
  return !isNaN(numPrice) && numPrice > 0;
};

export const validateSeats = (seats: number): boolean => {
  return Number.isInteger(seats) && seats > 0 && seats <= 6;
};