// Directory: backend/src/middleware/auth.middleware.js
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');
const User = require('../models/User');

/**
 * This is the main authentication middleware.
 * It's the "security guard" that protects our routes.
 */
const protect = async (req, res, next) => {
  let token;

  // 1. Check if the 'Authorization' header exists and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 2. Get the token from the header (e.g., "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // 3. Verify the token using our secret key
      
      const decoded = jwt.verify(token, JWT_SECRET);

      // 4. Find the user from the token's ID and attach it to the request object
      // We exclude the password from the data we attach.
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found, invalid token' });
      }

      // 5. Call 'next()' to pass control to the next function (the API controller)
      next();
    } catch (error) {
      console.error('Token verification failed:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

/**
 * This is a role-checking middleware.
 * It checks if the user (who is already authenticated by 'protect')
 * has the 'host' role.
 */
const isHost = (req, res, next) => {
  // We check the 'req.user' object that the 'protect' middleware attached for us
  if (req.user && req.user.role === 'host') {
    next(); // User is a host, allow them to proceed
  } else {
    return res.status(403).json({ message: 'Forbidden: You must be a host to perform this action' });
  }
};

module.exports = {
  protect,
  isHost,
};