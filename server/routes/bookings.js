const express = require('express');
const Booking = require('../models/Booking');
const Ride = require('../models/Ride');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all bookings for the current user
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    let bookings;
    if (user.role === 'passenger') {
      // Get bookings made by this passenger
      bookings = await Booking.find({ passengerId: req.userId })
        .populate('rideId')
        .sort({ createdAt: -1 });
    } else {
      // Get bookings for rides offered by this driver
      const rides = await Ride.find({ driverId: req.userId });
      const rideIds = rides.map(ride => ride._id);
      
      bookings = await Booking.find({ rideId: { $in: rideIds } })
        .populate('rideId')
        .populate('passengerId', 'name email')
        .sort({ createdAt: -1 });
    }
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// Create a new booking
router.post('/', auth, async (req, res) => {
  try {
    const { rideId, passengers, seatsBooked } = req.body;
    
    // Check if ride exists
    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ detail: 'Ride not found' });
    }
    
    // Check if enough seats are available
    if (ride.seatsAvailable < seatsBooked) {
      return res.status(400).json({ detail: 'Not enough seats available' });
    }
    
    // Create booking
    const booking = new Booking({
      rideId,
      passengerId: req.userId,
      passengers,
      seatsBooked,
      status: 'pending'
    });
    
    await booking.save();
    
    // Get passenger details to send to driver
    const passenger = await User.findById(req.userId).select('name email');
    
    // Notify driver about the new booking (using Socket.io)
    const io = req.app.get('io');
    io.to(`driver-${ride.driverId}`).emit('new_booking', {
      bookingId: booking._id,
      ride: {
        from: ride.from,
        to: ride.to,
        date: ride.date,
        departureTime: ride.departureTime
      },
      passenger: {
        name: passenger.name,
        email: passenger.email
      },
      seatsBooked,
      status: 'pending'
    });
    
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// Update booking status (accept/reject)
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ detail: 'Invalid status' });
    }
    
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ detail: 'Booking not found' });
    }
    
    // Check if user is the driver of this ride
    const ride = await Ride.findById(booking.rideId);
    if (!ride || ride.driverId.toString() !== req.userId) {
      return res.status(403).json({ detail: 'Not authorized to update this booking' });
    }
    
    booking.status = status;
    await booking.save();
    
    // If rejected, restore seats
    if (status === 'rejected') {
      ride.seatsAvailable += booking.seatsBooked;
      await ride.save();
    } else if (status === 'accepted') {
      // For accepted bookings, we already reduced the seats when booking was created
      // But we need to confirm the reduction is permanent
      
      // Get passenger details
      const passenger = await User.findById(booking.passengerId).select('name email');
      
      // Notify passenger about booking acceptance
      const io = req.app.get('io');
      io.to(`passenger-${booking.passengerId}`).emit('booking_status_updated', {
        bookingId: booking._id,
        status: 'accepted',
        ride: {
          from: ride.from,
          to: ride.to,
          date: ride.date,
          departureTime: ride.departureTime
        }
      });
    }
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

module.exports = router;
