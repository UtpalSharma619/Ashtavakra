// Directory: backend/src/models/Booking.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// This is the model for a Business booking a Session.
// Team A will manage this, but we need it defined now.

const bookingSchema = new Schema({
  businessId: {
    type: Schema.Types.ObjectId,
    ref: 'Business', 
    required: true,
  },
  sessionId: {
    type: Schema.Types.ObjectId,
    ref: 'Session', 
    required: true,
  },
  hostId: {
    type: Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  // We can add the cost, status, etc. later
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
  },
}, {
  timestamps: true,
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;