// Directory: backend/src/models/User.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// This is the Mongoose Schema for a User.
// It defines the data structure for all users (Hosts, Guests, Business owners).


/* [Image of a database schema diagram for the User model] */


const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // No two users can have the same email
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    // Note: We will hash this password in our auth service, not here.
  },
  role: {
    type: String,
    required: true,
    enum: ['host', 'business', 'guest'], // The role must be one of these
    default: 'guest',
  },
  
  // --- Host-Specific Fields (Team B) ---
  disabilityProfile: {
    // This object will store the host's adaptive UI needs
    // e.g., { ui: 'screen-reader-optimized', needsTTS: true }
    type: Object,
    default: {}, 
  },
  
  // --- Business-Specific Fields (Team A) ---
  // We can add a link to a Business profile
  // businessProfile: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'Business'
  // }

}, {
  // timestamps: true will automatically add 'createdAt' and 'updatedAt' fields
  timestamps: true,
});

// This creates the 'User' model in our database.
const User = mongoose.model('User', userSchema);

module.exports = User;