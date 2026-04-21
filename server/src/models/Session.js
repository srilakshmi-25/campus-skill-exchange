/**
 * Session Schema
 * Represents a single peer learning session between two students
 * Tracks session status throughout its lifecycle
 * 
 * Status transitions:
 * PENDING (initial) → ACCEPTED (learner accepts teacher request)
 * → ONGOING (session started) → COMPLETED (session finished)
 * PENDING → REJECTED (if either party declines)
 */

const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  // Participants
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User teaching the skill
  learnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User learning the skill
  
  // Session Details
  skill: { type: String, required: true }, // Skill being taught/learned
  status: { type: String, enum: ['PENDING', 'ACCEPTED', 'ONGOING', 'COMPLETED', 'REJECTED'], default: 'PENDING' } // Current session status
}, { timestamps: true }); // createdAt for request time, updatedAt for last status change

module.exports = mongoose.model('Session', sessionSchema);
