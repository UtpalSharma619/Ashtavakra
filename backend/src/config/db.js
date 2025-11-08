// Directory: backend/src/config/db.js
const mongoose = require('mongoose');
const { MONGO_URI } = require('./env'); // Import our secret URI

// This file creates the connection to our MongoDB database.

const connectDB = async () => {
  try {
    // Attempt to connect to the MongoDB Atlas cluster
    await mongoose.connect(MONGO_URI);

    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    // If connection fails, log the error and exit the whole app
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;