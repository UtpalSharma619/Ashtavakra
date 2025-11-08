// Directory: backend/src/utils/roomCodeGenerator.js
const { customAlphabet } = require('nanoid');

// This file creates a small, fast, and reliable room code generator.

// 1. Define the "alphabet" for our codes.
// We'll use uppercase letters and numbers.
// We remove "0", "O", "I", "1", "L" to avoid confusion.
const alphabet = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';

// 2. Configure nanoid to generate codes of length 6 using our alphabet.
const nanoid = customAlphabet(alphabet, 6);

/**
 * Generates a unique 6-character room code.
 * e.g., "A1B2C3"
 * @returns {string} A 6-character room code.
 */
const generateRoomCode = () => {
  // nanoid() will generate a random string like "K3R7P8"
  return nanoid();
};

module.exports = {
  generateRoomCode,
};