// Directory: backend/src/controllers/room.controller.js
const roomService = require('../services/room.service');

// This is the "Traffic Cop" file.
// It parses the request, calls the "brain" (service), and sends the response.

/**
 * Controller for POST /api/room/create
 * Creates a new private room.
 */
const createRoomController = async (req, res) => {
  try {
    // --- HACKATHON FIX for Testing ---
    // We are temporarily hard-coding the host and experience IDs
    // instead of getting them from the request.
    const hostId = '690f49536feb999952ef35a6';
    const experienceId = '690f49f86feb999952ef35a7';
    // --- END HACKATHON FIX ---

    // Original code (commented out):
    // const { experienceId } = req.body;
    // const hostId = req.user.id; 

    if (!experienceId) {
      return res.status(400).json({ message: 'Experience ID is required' });
    }

    // 3. Call the "brain" (service) to do the work.
    const newSession = await roomService.createRoom(hostId, experienceId);

    // 4. Send a "201 Created" response with the new session data.
    res.status(201).json(newSession);

  } catch (error) {
    console.error('Error in createRoomController:', error.message);
    res.status(500).json({ message: 'Server error while creating room' });
  }
};

/**
 * Controller for POST /api/room/join
 * Joins an existing private room.
 */
const joinRoomController = async (req, res) => {
  try {
    // 1. Get the roomCode from the request body.
    const { roomCode } = req.body;

    if (!roomCode) {
      return res.status(400).json({ message: 'Room code is required' });
    }

    // 2. Call the "brain" (service) to find the room.
    // This diagram shows the data flow for this request:
    
    const session = await roomService.joinRoom(roomCode.toUpperCase());

    // 3. The frontend doesn't need all the data.
    // We'll create a simple object to send back.
    const guestResponse = {
      sessionId: session._id,
      experienceTitle: session.experienceId?.title || 'Live Session',
      hostName: session.hostId?.username || 'Host',
    };

    // 4. Send a "200 OK" response with the room info.
    res.status(200).json(guestResponse);

  } catch (error) {
    // 5. Handle errors
    console.error('Error in joinRoomController:', error.message);

    // Specifically check for the "Invalid code" error from our service.
    if (error.message.includes('Invalid or expired room code')) {
      return res.status(404).json({ message: error.message });
    }

    // Send a generic server error for anything else.
    res.status(500).json({ message: 'Server error while joining room' });
  }
};

module.exports = {
  createRoomController,
  joinRoomController,
};