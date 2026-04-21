/**
 * Rating Schema
 * Represents peer feedback submitted after a completed session
 * Ratings are used to calculate and update user trust scores
 */

const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  // Session & Participants
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true }, // Session being rated
  fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Rater (can be teacher or learner)
  toUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Person being rated
  
  // Rating Data
  rating: { type: Number, required: true, min: 1, max: 5 }, // Star rating 1-5
  feedback: { type: String } // Optional written feedback/comments
}, { timestamps: true }); // createdAt for when rating was submitted

module.exports = mongoose.model('Rating', ratingSchema);
