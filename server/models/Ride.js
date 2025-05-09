const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  from: { type: String, required: true },
  fromDetail: { type: String, required: true },
  to: { type: String, required: true },
  toDetail: { type: String, required: true },
  date: { type: String, required: true },
  departureTime: { type: String, required: true },
  arrivalTime: { type: String, required: true },
  price: { type: String, required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  driverName: { type: String, required: true },
  driverRating: { type: Number, default: 0 },
  carModel: { type: String, required: true },
  seatsAvailable: { type: Number, required: true },
  verified: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
  amenities: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ride', rideSchema);