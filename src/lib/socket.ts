// Simplified mock implementation for now
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Create a mock socket object
export const socket = {
  auth: {},
  connect: () => console.log('Socket connected'),
  disconnect: () => console.log('Socket disconnected'),
  emit: (event: string, data: any) => console.log(`Emitted ${event}:`, data),
  on: (event: string, callback: Function) => {
    console.log(`Registered listener for ${event}`);
    return () => console.log(`Removed listener for ${event}`);
  },
  off: (event: string) => console.log(`Removed all listeners for ${event}`)
};

// Function to connect socket with user ID
export const connectSocket = (userId: string, role: 'passenger' | 'driver') => {
  // Add auth token if available
  const token = localStorage.getItem('elitecars_token');
  if (token) {
    socket.auth = { token };
  }
  
  // Connect to socket
  socket.connect();
  
  // Join user-specific room
  socket.emit('join_room', `${role}-${userId}`);
  
  return () => {
    socket.disconnect();
  };
};

// Add a note in the console
console.log('Using mock socket implementation - real-time features will be simulated');

