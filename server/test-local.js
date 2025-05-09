// Test connection to local MongoDB
require('dotenv').config();
const mongoose = require('mongoose');

// Use local connection string
const uri = "mongodb://localhost:27017/elite_cars";
console.log('Testing connection to local MongoDB...');

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
})
.then(() => {
  console.log('✅ Successfully connected to local MongoDB!');
  console.log('Connection state:', mongoose.connection.readyState);
  return mongoose.connection.close();
})
.then(() => {
  console.log('Connection closed.');
})
.catch(err => {
  console.error('❌ Connection failed with error:');
  console.error(err);
});