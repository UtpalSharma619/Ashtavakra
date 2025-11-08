// Directory: backend/src/models/Session.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// This is the Mongoose Schema for a Session (i.e., a "Room").
// This is the core data model for Team B's feature.

const sessionSchema = new Schema({
  // hostId: This links to the User who created the room.
  hostId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // This tells Mongoose to link to the 'User' model
    required: true,
  },
  
  // experienceId: This links to the 'Experience' template.
  // We save this so we know what kind of session it is (e.g., "Sensory Coffee").
  experienceId: {
    type: Schema.Types.ObjectId,
    ref: 'Experience',
    required: true,
  },

  // roomCode: The 6-digit code for guests to join.
  roomCode: {
    type: String,
    required: true,
    unique: true, // Every room code must be unique
    index: true, // We add an index to make finding rooms by code very fast
  },

  isPrivate: {
    type: Boolean,
    default: true,
  },

  // expiresAt: This is a critical field for performance.
  // We will set this to 6 hours from now.
  // We will also tell MongoDB to automatically delete this document
  // when the expiration time is reached.
  expiresAt: {
    type: Date,
    required: true,
  },

  // We can also store a list of guest participants
  participants: [{
    // This could be a guest's User ID or just a temporary name
    guestName: { type: String }
  }]

}, {
  timestamps: true, // Adds createdAt and updatedAt
});

// --- CRITICAL FOR PERFORMANCE: TTL INDEX ---
// This tells MongoDB to automatically delete a session document
// 'expireAfterSeconds: 0' seconds *after* the time specified in 'expiresAt'.
// This is a "Time-To-Live" (TTL) index.
//
// This is the best way to clean up old, expired rooms from our database
// without writing any new code.
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });



const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;