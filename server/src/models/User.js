/**
 * User Schema
 * Represents a student in the Campus Skill Exchange platform
 * Stores profile, skills, trust metrics, and account status
 */

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Basic Profile Information
  name: { type: String, required: true }, // Student's full name
  email: { type: String, required: true, unique: true }, // Unique email for login
  password: { type: String, required: true }, // Bcrypted password
  
  // Skills Data
  skillsToTeach: [{ type: String }], // Array of skills this student can teach
  skillsToLearn: [{ type: String }], // Array of skills this student wants to learn
  
  // Reputation & Trust Metrics
  rating: { type: Number, default: 0 }, // Average peer rating (0-5)
  trustScore: { type: Number, default: 0 }, // Calculated trust score for reliability
  
  // Account Management
  role: { type: String, enum: ['student', 'admin'], default: 'student' }, // User role
  status: { type: String, enum: ['active', 'blocked', 'banned'], default: 'active' }, // Account status
  
  // Profile Details
  bio: { type: String, default: '' }, // User bio/about section
  avatar: { type: String, default: '' }, // Avatar/profile picture URL
  
  // Availability
  availability: [{
    day: { type: String }, // Day of week (Mon-Sun)
    startTime: { type: String }, // Available from time
    endTime: { type: String } // Available until time
  }]
}, { timestamps: true }); // Auto createdAt and updatedAt

module.exports = mongoose.model('User', userSchema);
