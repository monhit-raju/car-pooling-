// Database inspection script
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Ride = require('./models/Ride');
const Booking = require('./models/Booking');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('✅ Connected to MongoDB');
  
  try {
    // Get database stats
    const userCount = await User.countDocuments();
    const rideCount = await Ride.countDocuments();
    const bookingCount = await Booking.countDocuments();
    
    console.log('\n📊 DATABASE STATISTICS:');
    console.log('------------------------');
    console.log(`Database: ${mongoose.connection.db.databaseName}`);
    console.log(`Users: ${userCount}`);
    console.log(`Rides: ${rideCount}`);
    console.log(`Bookings: ${bookingCount}`);
    
    // List all users
    console.log('\n👤 USERS:');
    console.log('------------------------');
    const users = await User.find().select('-password');
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Role: ${user.role}`);
    });
    
    // List all rides
    console.log('\n🚗 RIDES:');
    console.log('------------------------');
    const rides = await Ride.find().populate('driver', 'name email');
    rides.forEach(ride => {
      console.log(`- From ${ride.from} to ${ride.to} - Driver: ${ride.driver?.name || 'Unknown'} - Price: $${ride.price}`);
    });
    
    // List all bookings
    console.log('\n📝 BOOKINGS:');
    console.log('------------------------');
    const bookings = await Booking.find()
      .populate('rideId', 'from to')
      .populate('passengerId', 'name email');
    bookings.forEach(booking => {
      console.log(`- Passenger: ${booking.passengerId?.name || 'Unknown'} - Ride: ${booking.rideId?.from || 'Unknown'} to ${booking.rideId?.to || 'Unknown'} - Status: ${booking.status}`);
    });
    
    // Check database consistency
    console.log('\n🔍 CHECKING DATABASE CONSISTENCY:');
    console.log('------------------------');
    try {
      const result = await mongoose.connection.db.command({ checkMetadataConsistency: 1 });
      console.log('Consistency check result:', result);
    } catch (error) {
      console.error('Error checking database consistency:', error.message);
    }
    
  } catch (error) {
    console.error('Error inspecting database:', error);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('\nConnection closed.');
  }
})
.catch(err => {
  console.error('❌ Connection failed with error:', err);
});