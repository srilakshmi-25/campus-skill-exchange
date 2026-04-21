/**
 * Rating Controller
 * Handles peer feedback submission after completed sessions
 * Ratings automatically trigger trust score recalculation for the rated user
 */

const Rating = require('../models/Rating');
const Notification = require('../models/Notification');
const { calculateAndUserUpdateTrustScore } = require('../services/trustScore');

/**
 * Submit rating/feedback for a peer after session completion
 * @route POST /rating
 * @access Protected (requires JWT token)
 * @param {string} sessionId - Completed session being rated
 * @param {string} toUserId - User being rated
 * @param {number} rating - Star rating 1-5
 * @param {string} feedback - Optional written feedback
 * @returns {object} Created rating document
 * 
 * Side effects:
 * - Recalculates toUser's trust score automatically
 * - Sends notification to rated user
 */
const submitRating = async (req, res) => {
  try {
    const { sessionId, toUserId, rating, feedback } = req.body;

    // Optional MVP: Check if session is completed and users were in it

    const newRating = await Rating.create({
      sessionId,
      fromUserId: req.user._id,
      toUserId,
      rating,
      feedback
    });

    // Recompute target user's trust score
    await calculateAndUserUpdateTrustScore(toUserId);

    // Notify the rated user
    await Notification.create({
      recipient: toUserId,
      sender: req.user._id,
      type: 'rating',
      message: `${req.user.name} gave you a ${rating}-star rating!`,
      link: '/profile'
    });

    res.status(201).json(newRating);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all ratings/feedback received by a user
 * @route GET /rating/:id
 * @access Public
 * @param {string} id - User ID to fetch ratings for
 * @returns {array} Array of ratings with rater information
 */
const getUserRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ toUserId: req.params.id }).populate('fromUserId', 'name');
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { submitRating, getUserRatings };
