// Directory: backend/src/models/Experience.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// This is the blueprint for an Experience.
// We are creating this file so that Mongoose
// can successfully .populate() it in our room.service.js

const experienceSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  // Other fields Team A might add later...
  // duration: { type: Number, default: 20 }, // e.g., in minutes
  // category: { type: String }

}, {
  timestamps: true,
});

// This line is the most important part.
// It officially registers the 'Experience' model with Mongoose.
const Experience = mongoose.model('Experience', experienceSchema);

module.exports = Experience;