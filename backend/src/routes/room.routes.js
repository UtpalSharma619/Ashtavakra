// Directory: backend/src/routes/room.routes.js
const express = require('express');
const router = express.Router();

// 1. Import our "Traffic Cop" (Controller)
const {
  createRoomController,
  joinRoomController,
} = require('../controllers/room.controller');

// 2. Import our "Security Guards" (Middleware)
const { protect, isHost } = require('../middleware/auth.middleware');

// This file defines the actual API URLs for your feature.
// It maps a URL to the correct security and controller.

// --- The "Create Room" Route ---
// URL: POST /api/room/create
//
// This route is SECURE. It uses two security guards:
// 1. protect: Checks if the user is logged in (has a valid token).
// 2. isHost: Checks if the user has the 'host' role.
//
// Only if both pass, it will run 'createRoomController'.

router.post(
  '/create',
  /* protect,
  isHost, */
  createRoomController
);

// --- The "Join Room" Route ---
// URL: POST /api/room/join
//
// This route is PUBLIC. Anyone (like a guest) can try to join.
// It has no security guards and goes straight to the controller.
router.post('/join', joinRoomController);

module.exports = router;