// Directory: backend/src/sockets/session.socket.js

// This file exports a handler function for a single socket connection.
// It's the logic for what happens when one user joins the live session.

const sessionSocketHandler = (io, socket) => {
  try {
    // 1. Get the sessionId and role from the handshake query.
    // The frontend sends this data when it connects.
    const { sessionId, role } = socket.handshake.query;

    if (!sessionId) {
      console.error('Socket disconnected: No sessionId provided');
      socket.disconnect(true); // Force disconnect if no room is specified
      return;
    }

    // 2. Join the specific "room" (which is the sessionId).
    // Now, this socket will only receive messages for this room.
    socket.join(sessionId);
    console.log(`Socket ${socket.id} (Role: ${role}) joined room ${sessionId}`);

    // 3. Send a system notification to everyone *else* in the room.
    // The 'socket.to(sessionId)' part means "to everyone in this room *except* me."
    
    socket.to(sessionId).emit('system:notification', {
      text: role === 'host' ? 'The host has joined.' : 'A new guest has joined.'
    });

    // 4. Listen for chat messages from this client
    socket.on('chat:send', (message) => {
      // When we get a message, broadcast it to everyone else in the room.
      // The frontend UI is already "optimistically" showing the message
      // for the sender, so we don't need to send it back to them.
      
      socket.to(sessionId).emit('chat:receive', message);
    });

    // 5. Listen for this client to disconnect
    socket.on('disconnect', () => {
      console.log(`Socket ${socket.id} disconnected from room ${sessionId}`);
      // Send a "left" notification to the room
      socket.to(sessionId).emit('system:notification', {
        text: 'A user has left the session.'
      });
    });

  } catch (error) {
    console.error('Socket error:', error.message);
    // Send a generic error back to this specific client
    socket.emit('error', { message: 'An internal socket error occurred' });
  }
};

module.exports = sessionSocketHandler;