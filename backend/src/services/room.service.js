// Directory: backend/src/services/room.service.js
const Session = require('../models/Session');
require('../models/Experience'); // <-- THIS IS THE FIX. IT REGISTERS THE MODEL.
const { generateRoomCode } = require('../utils/roomCodeGenerator');

// This is the "brain" for your feature.
// It handles all the database logic for creating and joining rooms.

/**
 * Creates a new session (room) in the database.
 * @param {string} hostId - The ID of the host creating the room.
 * @param {string} experienceId - The ID of the experience being hosted.
 * @returns {object} The newly created session document.
 */
const createRoom = async (hostId, experienceId) => {
  try {
    // 1. Generate a unique 6-digit room code
    const roomCode = generateRoomCode();

    // 2. Set an expiration date (e.g., 6 hours from now)
    // The TTL index on the Session model will auto-delete it after this time.
    const expiresAt = new Date(Date.now() + 6 * 60 * 60 * 1000); // 6 hours

    // 3. Create a new session document in memory
    
    const newSession = new Session({
      hostId,
      experienceId,
      roomCode,
      expiresAt,
      isPrivate: true,
    });

    // 4. Save the new session to the database
    await newSession.save();

    console.log(`New room created: ${roomCode} by host ${hostId}`);
    return newSession;

  } catch (error) {
    // This will catch errors, e.g., if the roomCode (by chance) wasn't unique
    console.error('Error creating room:', error.message);
    throw new Error('Could not create a new room');
  }
};

/**
 * Finds a session by its room code for a guest to join.
 * @param {string} roomCode - The 6-digit room code.
 * @returns {object} The found session document with host/experience info.
 */
const joinRoom = async (roomCode) => {
  // 1. Find the session in the database.
  // We check for the roomCode AND make sure it hasn't expired.
  const session = await Session.findOne({
    roomCode: roomCode,
    expiresAt: { $gt: new Date() }, // Find only if 'expiresAt' is in the future
  })
  .populate('hostId', 'username') //
  .populate('experienceId', 'title'); // <-- This command will now work

  // 2. If no session is found, or it's expired, throw an error.
  if (!session) {
    throw new Error('Invalid or expired room code');
  }

  // 3. Return the session data.
  // The 'populate' calls will have added the host's username
  // and the experience's title, just like the frontend needs.
  return session;
};

module.exports = {
  createRoom,
  joinRoom,
};