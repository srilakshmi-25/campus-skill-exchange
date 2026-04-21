/**
 * Matching Engine Service
 * Core algorithm for bidirectional peer matching based on complementary skills
 * Integrates optional OpenAI GPT-3.5 for generating personalized learning roadmaps
 */

const User = require('../models/User');
const config = require('../config/env');

/**
 * Calculate compatibility score between two users
 * Score prioritizes bidirectional skill matches (3x weight) + mutual interest (2x weight)
 * @param {object} userA - First user document
 * @param {object} userB - Second user document
 * @returns {number} Match score (higher = better compatibility)
 * Formula: (teachMatch × 3) + (learnMatch × 3) + (mutualInterestBoost × 2)
 */
const calculateMatchScore = (userA, userB) => {
  const teachMatch = userA.skillsToTeach.filter(skill =>
    userB.skillsToLearn.includes(skill)
  ).length;

  const learnMatch = userB.skillsToTeach.filter(skill =>
    userA.skillsToLearn.includes(skill)
  ).length;

  const mutualInterestBoost = userA.skillsToLearn.filter(skill =>
    userB.skillsToTeach.includes(skill)
  ).length;

  return (teachMatch * 3) + (learnMatch * 3) + (mutualInterestBoost * 2);
};

/**
 * Get sorted list of matched peers for a user
 * @param {string} userId - Current user's MongoDB ObjectId
 * @returns {array} Matched users sorted by match score (highest first)
 * Only returns matches with score > 0
 */
const getSuggestions = async (userId) => {
  const currentUser = await User.findById(userId);
  if (!currentUser) throw new Error('User not found');

  // Fetch all other active users
  const allUsers = await User.find({ _id: { $ne: currentUser._id } });

  const matches = allUsers.map(userB => {
    const score = calculateMatchScore(currentUser, userB);
    return {
      user: {
        _id: userB._id,
        name: userB.name,
        skillsToTeach: userB.skillsToTeach,
        skillsToLearn: userB.skillsToLearn,
        rating: userB.rating,
        trustScore: userB.trustScore,
      },
      score
    };
  });

  return matches
    .filter(match => match.score > 0)
    .sort((a, b) => b.score - a.score);
};

/**
 * Generate learning roadmap for a skill using AI or fallback
 * @param {string} skill - Skill to generate roadmap for
 * @returns {object} {source: 'ai'|'static', roadmap: string}
 * Attempts OpenAI GPT-3.5 first; silently falls back to static roadmap on failure
 * This ensures graceful degradation when API key is missing or API is unavailable
 */
const getLearningRoadmap = async (skill) => {
  // Try AI-powered roadmap if OpenAI key is configured
  if (config.OPENAI_API_KEY && config.OPENAI_API_KEY !== 'sk-your-openai-api-key-here') {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: `Generate a fast 3-step learning roadmap for the student skill: ${skill}` }]
        })
      });
      const data = await response.json();
      if (data.choices && data.choices[0]) {
        return { source: 'ai', roadmap: data.choices[0].message.content };
      }
    } catch (err) {
      console.error("OpenAI failure (silencing crash):", err.message);
    }
  }

  // Fallback if AI disabled or crashed
  return {
    source: 'static',
    roadmap: `1. Grasp the fundamentals of ${skill}.\n2. Schedule a peer learning session.\n3. Apply knowledge practically.`
  };
};

module.exports = { getSuggestions, calculateMatchScore, getLearningRoadmap };
