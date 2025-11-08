// Directory: backend/src/config/env.js
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// This file loads and validates your secrets from .env

// 1. Load and validate MONGO_URI
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("FATAL ERROR: MONGO_URI is not set in the .env file.");
  process.exit(1); // Exit the app if the database string is missing
}

// 2. Load and validate JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not set in the .env file.");
  process.exit(1); // Exit the app if the secret is missing
}

// 3. Set the port. We use 3001 to avoid colliding with the frontend (3000)
const PORT = process.env.PORT || 3001;

// Export the validated variables so the rest of our app can use them
module.exports = {
  MONGO_URI,
  JWT_SECRET,
  PORT,
};