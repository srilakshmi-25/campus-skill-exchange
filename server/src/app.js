/**
 * Express App Configuration
 * Sets up server middleware, database connection, and routes
 * 
 * Routes:
 * - /api/auth - User registration and login
 * - /api/users - User profile management
 * - /api/match - Peer matching and learning roadmaps
 * - /api/session - Learning session lifecycle
 * - /api/rating - Peer ratings and feedback
 * - /api/notifications - User notifications
 * - /api/admin - Platform administration (protected)
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

// Connect to MongoDB database
connectDB();

const app = express();

/**
 * Middleware Configuration
 * - CORS: Enable cross-origin requests from frontend
 * - JSON: Parse application/json request bodies
 */
app.use(cors());
app.use(express.json());

/**
 * API Routes
 * All protected routes require JWT token in Authorization header
 */
// Public auth routes: register, login
app.use('/api/auth', require('./routes/authRoutes'));
// Protected user routes: profile, change password
app.use('/api/users', require('./routes/userRoutes'));
// Protected matching routes: suggestions, learning roadmaps
app.use('/api/match', require('./routes/matchRoutes'));
// Protected session routes: request, update, get sessions
app.use('/api/session', require('./routes/sessionRoutes'));
// Protected rating routes: submit, view ratings
app.use('/api/rating', require('./routes/ratingRoutes'));
// Admin only routes: analytics, user management, settings
app.use('/api/admin', require('./routes/adminRoutes'));
// Protected notification routes: get, mark as read
app.use('/api/notifications', require('./routes/notificationRoutes'));

module.exports = app;
