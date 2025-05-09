// Simple script to test MongoDB connection
require('dotenv').config();
const mongoose = require('mongoose');

console.log('Testing MongoDB connection...');
console.log('Connection string (redacted password):');
console.log(process.env.MONGODB_URI.replace(/mongodb\+srv:\/\/[^:]+:([^@]+)@/, 'mongodb+srv://[username]:[hidden]@'));

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000 // 10 seconds
})
.then(() => {
  console.log('✅ Successfully connected to MongoDB Atlas!');
  console.log('Connection state:', mongoose.connection.readyState);
  return mongoose.connection.close();
})
.then(() => {
  console.log('Connection closed.');
})
.catch(err => {
  console.error('❌ Connection failed with error:');
  console.error(err);
  
  // Additional troubleshooting info
  if (err.name === 'MongooseServerSelectionError') {
    console.log('\n🔍 TROUBLESHOOTING SUGGESTIONS:');
    console.log('1. Check if MongoDB Atlas is up: https://status.mongodb.com/');
    console.log('2. Verify your username and password are correct');
    console.log('3. Make sure your cluster is active in MongoDB Atlas');
    console.log('4. Try using a different network (e.g., mobile hotspot)');
    console.log('5. Check if your network blocks MongoDB connections (port 27017)');
  }
});