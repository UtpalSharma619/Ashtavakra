// Directory: backend/src/sockets/index.js
const { Server } = require('socket.io');
const sessionSocketHandler = require('./session.socket');

// This file is the "main switchboard" for the Socket.io server.

const initSocketServer = (httpServer) => {
  // 1. Create a new Socket.io server and attach it to the main HTTP server
  const io = new Server(httpServer, {
    // 2. Configure CORS to allow our frontend (running on localhost:3000)
    // to connect to this server (running on localhost:3001).
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  // 3. This is the main connection listener.
  // It runs every time a new user (a new socket) connects.
  io.on('connection', (socket) => {
    // 4. When a user connects, pass them to our modular session handler.
    // This keeps our main file clean.
    // The handler will take care of joining rooms, listening for chat, etc.
    
    sessionSocketHandler(io, socket);
  });

  console.log('📡 Socket.io server initialized');
  return io;
};

module.exports = {
  initSocketServer,
};