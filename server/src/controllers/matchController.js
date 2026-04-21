/**
 * Match Controller
 * Handles peer matching suggestions using bidirectional matching engine
 * Integrates optional AI-powered learning roadmaps via OpenAI
 */

const { getSuggestions, getLearningRoadmap } = require('../services/matchingEngine');

/**
 * Get list of matched peers based on complementary skills
 * @route GET /match/suggestions
 * @access Protected (requires JWT token)
 * @returns {array} Array of matched users with match scores, sorted by score descending
 * Scoring formula: (teachMatch × 3) + (learnMatch × 3) + (mutualBoost × 2)
 */
const getMatches = async (req, res) => {
  try {
    const suggestions = await getSuggestions(req.user._id);
    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get AI-powered learning roadmap for a specific skill
 * @route POST /match/roadmap
 * @access Protected (requires JWT token)
 * @param {string} skill - Skill name to generate roadmap for
 * @returns {object} Learning roadmap from OpenAI (or static fallback)
 * Uses OpenAI GPT-3.5-turbo if API key configured, otherwise returns static roadmap
 */
const fetchRoadmap = async (req, res) => {
  try {
    const { skill } = req.body;
    if (!skill) return res.status(400).json({ message: 'Skill required' });
    const result = await getLearningRoadmap(skill);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMatches, fetchRoadmap };
