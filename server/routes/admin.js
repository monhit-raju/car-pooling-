const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const Ride = require('../models/Ride');
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Middleware chain: first authenticate, then check if admin
router.use(auth, admin);

// Get database stats
router.get('/stats', async (req, res) => {
  try {
    const stats = {
      users: await User.countDocuments(),
      rides: await Ride.countDocuments(),
      bookings: await Booking.countDocuments(),
      databaseName: mongoose.connection.db.databaseName,
      connectionState: mongoose.connection.readyState
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching database stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all rides
router.get('/rides', async (req, res) => {
  try {
    const rides = await Ride.find().populate('driver', '-password');
    res.json(rides);
  } catch (error) {
    console.error('Error fetching rides:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all bookings
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('rideId')
      .populate('passengerId', '-password');
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Run MongoDB check metadata consistency command
router.get('/check-db', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const result = await db.command({ checkMetadataConsistency: 1 });
    res.json(result);
  } catch (error) {
    console.error('Error checking database consistency:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;