// Directory: backend/src/server.js
// This is the main entry point for the entire backend.

// --- 1. Core Node.js Imports ---
const http = require('http'); // For creating the HTTP server
const express = require('express');
const cors = require('cors');

// --- 2. Our Local Imports ---
// Configuration
const { PORT } = require('./config/env');
const connectDB = require('./config/db');

// Routes
const roomRoutes = require('./routes/room.routes');
// (We will import other routes here later, e.g., auth.routes.js)

// Sockets
const { initSocketServer } = require('./sockets');

// --- 3. Initialize the Application ---
const app = express();

// --- 4. Connect to Database ---
// We call this function from db.js to connect to MongoDB.
connectDB();

// --- 5. Apply Middlewares ---
// Enable CORS so our frontend on localhost:3000 can talk to this server.
app.use(cors());
// Parse incoming JSON request bodies.
app.use(express.json());

// --- 6. Define API Routes ---
// This is the "router" for your feature.
// It tells Express that any URL starting with "/api/room"
// should be handled by the 'roomRoutes' file.
app.use('/api/room', roomRoutes);
// (We'll add auth routes here later)
// app.use('/api/auth', authRoutes);

// A simple test route to make sure the server is alive
app.get('/', (req, res) => {
  res.send('Ashtavakra Backend is running!');
});

// --- 7. Create HTTP Server & Initialize Socket.io ---
// We create an HTTP server *from* the Express app.
// This is necessary to attach Socket.io to it.
const httpServer = http.createServer(app);

// Initialize our "socket switchboard" and pass it the server.
initSocketServer(httpServer);

//[Image of a backend server architecture diagram showing how server.js acts as the central hub, with arrows pointing to: 1. connectDB (MongoDB), 2. app.use() (API Routes), and 3. initSocketServer (WebSocket Connections)]

// --- 8. Start the Server ---
httpServer.listen(PORT, () => {
  console.log('---------------------------------');
  console.log(`🚀 Ashtavakra Backend Server 🚀`);
  console.log(`✅ API running on http://localhost:${PORT}`);
  console.log(`📡 Sockets listening on ws://localhost:${PORT}`);
  console.log('---------------------------------');
});