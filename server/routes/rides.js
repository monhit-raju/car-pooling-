const express = require('express');
const Ride = require('../models/Ride');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all rides
router.get('/', async (req, res) => {
  try {
    const rides = await Ride.find().sort({ createdAt: -1 });
    res.json(rides);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// Create a new ride
router.post('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ detail: 'User not found' });
    }
    
    if (user.role !== 'driver') {
      return res.status(403).json({ detail: 'Only drivers can create rides' });
    }
    
    const rideData = {
      ...req.body,
      driverId: user._id,
      driverName: user.name
    };
    
    const ride = new Ride(rideData);
    await ride.save();
    
    res.status(201).json(ride);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// Get a specific ride
router.get('/:id', async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) {
      return res.status(404).json({ detail: 'Ride not found' });
    }
    
    res.json(ride);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// Update a ride
router.put('/:id', auth, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) {
      return res.status(404).json({ detail: 'Ride not found' });
    }
    
    // Check if user is the driver of this ride
    if (ride.driverId.toString() !== req.userId) {
      return res.status(403).json({ detail: 'Not authorized to update this ride' });
    }
    
    const updatedRide = await Ride.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    res.json(updatedRide);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

module.exports = router;