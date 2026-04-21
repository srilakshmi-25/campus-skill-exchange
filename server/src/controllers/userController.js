/**
 * User Controller
 * Handles student profile operations: view, update, and password changes
 * All routes protected - requires authenticated JWT token
 */

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { computeUserStats } = require('../services/userService');

/**
 * Get authenticated user's profile with computed statistics
 * @route GET /users/profile
 * @access Protected (requires JWT token)
 * @returns {object} User profile including name, email, skills, trustScore, stats
 */
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      const stats = await computeUserStats(user);
      res.json({
        ...user.toObject(),
        ...stats
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update authenticated user's profile information
 * @route PUT /users/profile
 * @access Protected (requires JWT token)
 * @param {string} name - Full name (optional)
 * @param {string} bio - User bio/about (optional)
 * @param {string} avatar - Avatar URL (optional)
 * @param {array} availability - Time slots when available (optional)
 * @param {array} skillsToTeach - Skills user can teach (optional)
 * @param {array} skillsToLearn - Skills user wants to learn (optional)
 * @returns {object} Updated user profile with stats
 */
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
      user.avatar = req.body.avatar !== undefined ? req.body.avatar : user.avatar;
      user.availability = req.body.availability !== undefined ? req.body.availability : user.availability;
      user.skillsToTeach = req.body.skillsToTeach !== undefined ? req.body.skillsToTeach : user.skillsToTeach;
      user.skillsToLearn = req.body.skillsToLearn !== undefined ? req.body.skillsToLearn : user.skillsToLearn;
      
      const updatedUser = await user.save();
      const stats = await computeUserStats(updatedUser);
      
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        bio: updatedUser.bio,
        avatar: updatedUser.avatar,
        availability: updatedUser.availability,
        skillsToTeach: updatedUser.skillsToTeach,
        skillsToLearn: updatedUser.skillsToLearn,
        role: updatedUser.role,
        status: updatedUser.status,
        ...stats
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Change user password with current password verification
 * @route PUT /users/change-password
 * @access Protected (requires JWT token)
 * @param {string} currentPassword - User's existing password (for verification)
 * @param {string} newPassword - New password (minimum 6 characters)
 * @returns {object} {message: 'Password changed successfully'}
 * @throws 401 if current password is incorrect
 * @throws 400 if new password is too short or missing fields
 * 
 * Security: Always verifies current password before allowing change
 */
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both current and new password are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.user._id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUserProfile, updateUserProfile, changePassword };

