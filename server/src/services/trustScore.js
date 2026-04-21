/**
 * Trust Score Service
 * Calculates and updates user reliability scores based on session completion
 * and peer ratings. Automatically triggered after each rating submission.
 * 
 * Formula: trustScore = (averageRating × 0.7) + (sessionsCompleted × 0.3)
 * This weights peer feedback (70%) higher than session count (30%)
 */

const User = require('../models/User');
const Session = require('../models/Session');
const Rating = require('../models/Rating');

/**
 * Calculate and persist trust score for a user
 * @param {string} userId - User's MongoDB ObjectId
 * @returns {number} Updated trust score
 * 
 * Process:
 * 1. Count completed sessions involving the user (as teacher or learner)
 * 2. Calculate average rating from all peer feedback
 * 3. Apply formula: (avgRating × 0.7) + (completedSessions × 0.3)
 * 4. Save both rating and trustScore to user document
 */
const calculateAndUserUpdateTrustScore = async (userId) => {
  // Get all completed sessions involving the user
  const sessions = await Session.find({
    status: 'COMPLETED',
    $or: [{ teacherId: userId }, { learnerId: userId }]
  });

  const sessionsCompleted = sessions.length;

  // Get average rating for the user
  const ratings = await Rating.find({ toUserId: userId });
  const averageRating = ratings.length > 0 
    ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
    : 0;

  // Rating out of 5. Trust score formula asks for: (averageRating * 0.7) + (sessionsCompleted * 0.3)
  // Let's cap sessionsCompleted effect at maybe 50 sessions for max boost, or just use raw formula as requested.
  // We'll normalize averageRating (0-5) to scale well with sessionsCompleted. 
  // Let's stick strictly to: trustScore = (averageRating * 0.7) + (sessionsCompleted * 0.3)
  const trustScore = (averageRating * 0.7) + (sessionsCompleted * 0.3);

  // Update user
  await User.findByIdAndUpdate(userId, { 
    rating: averageRating,
    trustScore: trustScore
  });

  return trustScore;
};

module.exports = { calculateAndUserUpdateTrustScore };
