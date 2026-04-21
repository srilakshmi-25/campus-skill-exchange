/**
 * Authentication Controller
 * Handles user registration, login, and authentication verification
 * Uses JWT tokens for session management and bcryptjs for password hashing
 */

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config/env');
const { computeUserStats } = require('../services/userService');

/**
 * Generates JWT token for authenticated user
 * @param {string} id - User MongoDB ObjectId
 * @returns {string} JWT token that expires based on JWT_EXPIRE config
 */
const generateToken = (id) => {
  return jwt.sign({ id }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRE,
  });
};

/**
 * Register new student account
 * @route POST /auth/register
 * @access Public
 * @param {string} name - Student's full name
 * @param {string} email - Unique email address
 * @param {string} password - Raw password (bcrypted before storage)
 * @param {array} skillsToTeach - Skills student can teach
 * @param {array} skillsToLearn - Skills student wants to learn
 * @returns {object} User object with JWT token
 */
const registerUser = async (req, res) => {
  const { name, email, password, skillsToTeach, skillsToLearn } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      skillsToTeach: skillsToTeach || [],
      skillsToLearn: skillsToLearn || []
    });

    if (user) {
      const stats = await computeUserStats(user);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        skillsToTeach: user.skillsToTeach,
        skillsToLearn: user.skillsToLearn,
        rating: user.rating,
        trustScore: user.trustScore,
        ...stats,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Authenticate user and return JWT token
 * @route POST /auth/login
 * @access Public
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {object} User data with JWT token, or error if banned/blocked
 * @throws 403 if account is banned or temporarily blocked
 * @throws 401 if credentials are invalid
 */
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Prevent banned/blocked users from accessing the platform
      if (user.status === 'banned') {
        return res.status(403).json({ message: 'Your account has been permanently banned.' });
      }
      if (user.status === 'blocked') {
        return res.status(403).json({ message: 'Your account is temporarily blocked. Contact admin.' });
      }
      const stats = await computeUserStats(user);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        skillsToTeach: user.skillsToTeach,
        skillsToLearn: user.skillsToLearn,
        rating: user.rating,
        trustScore: user.trustScore,
        ...stats,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get current authenticated user's profile
 * @route GET /auth/me
 * @access Protected (requires JWT token)
 * @returns {object} Current user profile without password field
 */
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
