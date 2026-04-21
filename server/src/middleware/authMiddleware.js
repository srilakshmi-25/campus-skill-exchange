/**
 * Authentication Middleware
 * Validates JWT tokens and enforces role-based access control
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/env');

/**
 * Verify JWT token and attach user to request
 * @middleware protect
 * @param {object} req - Express request
 * @param {object} res - Express response
 * @param {function} next - Next middleware
 * 
 * Expects: Authorization header with "Bearer {token}" format
 * Sets: req.user = authenticated user document (without password)
 * @throws 401 if token missing or invalid
 */
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, config.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

/**
 * Verify user has admin role
 * @middleware adminProtect
 * @requires protect middleware must run first to set req.user
 * @throws 403 if user is not admin role
 */
const adminProtect = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

module.exports = { protect, adminProtect };
