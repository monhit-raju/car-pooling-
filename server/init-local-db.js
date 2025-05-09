// Initialize local MongoDB with sample data
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models
const User = require('./models/User');
const Ride = require('./models/Ride');
const Booking = require('./models/Booking');

// Local connection string
const uri = "mongodb://localhost:27017/elite_cars";
console.log('Connecting to local MongoDB...');

// Sample data
const sampleUsers = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: bcrypt.hashSync('password123', 10),
    phone: '1234567890',
    role: 'passenger'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: bcrypt.hashSync('password123', 10),
    phone: '0987654321',
    role: 'driver',
    carDetails: {
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      color: 'Silver',
      licensePlate: 'ABC123'
    }
  }
];

// Connect to MongoDB and initialize data
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('✅ Connected to local MongoDB');
  
  // Clear existing data
  await User.deleteMany({});
  await Ride.deleteMany({});
  await Booking.deleteMany({});
  console.log('Cleared existing data');
  
  // Create users
  const createdUsers = await User.create(sampleUsers);
  console.log(`Created ${createdUsers.length} users`);
  
  // Get driver info for rides
  const driver = createdUsers.find(user => user.role === 'driver');
  const driverId = driver._id;
  
  // Sample rides with updated schema fields
  const sampleRides = [
    {
      from: 'New York',
      fromDetail: '123 Broadway, NY 10001',
      to: 'Boston',
      toDetail: '456 Main St, Boston, MA 02108',
      date: '2023-07-15',
      departureTime: '09:00',
      arrivalTime: '13:00',
      price: '45',
      driverId: driverId,
      driverName: driver.name,
      driverRating: 4.5,
      carModel: 'Toyota Camry 2020',
      seatsAvailable: 3,
      verified: true,
      rating: 4.8,
      amenities: ['Air Conditioning', 'Music', 'Water']
    },
    {
      from: 'Chicago',
      fromDetail: '789 Michigan Ave, Chicago, IL 60601',
      to: 'Detroit',
      toDetail: '321 Woodward Ave, Detroit, MI 48226',
      date: '2023-07-20',
      departureTime: '14:00',
      arrivalTime: '17:30',
      price: '35',
      driverId: driverId,
      driverName: driver.name,
      driverRating: 4.5,
      carModel: 'Honda Accord 2019',
      seatsAvailable: 2,
      verified: true,
      rating: 4.6,
      amenities: ['Air Conditioning', 'Snacks']
    }
  ];
  
  // Create rides
  const createdRides = await Ride.create(sampleRides);
  console.log(`Created ${createdRides.length} rides`);
  
  // Create a sample booking
  const passengerId = createdUsers.find(user => user.role === 'passenger')._id;
  const rideId = createdRides[0]._id;
  
  const sampleBooking = {
    rideId,
    passengerId,
    passengers: [
      {
        name: 'John Doe',
        aadhaarNumber: '123456789012',
        phone: '1234567890',
        email: 'john@example.com'
      }
    ],
    seatsBooked: 1,
    status: 'pending'
  };
  
  const createdBooking = await Booking.create(sampleBooking);
  console.log(`Created booking with ID: ${createdBooking._id}`);
  
  console.log('Database initialization complete!');
  
  // Close connection
  return mongoose.connection.close();
})
.then(() => {
  console.log('Connection closed.');
})
.catch(err => {
  console.error('❌ Error initializing database:', err);
});
