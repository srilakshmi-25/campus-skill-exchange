/**
 * Admin Controller
 * Platform administration and governance operations
 * Includes analytics, user management, session control, and system settings
 * All routes protected by adminProtect middleware - admin role required
 */

const User = require('../models/User');
const Session = require('../models/Session');
const Setting = require('../models/Setting');
const bcrypt = require('bcryptjs');

/**
 * ═══════════════════════════════════════════════════════════════
 * ANALYTICS ENDPOINTS - Dashboard statistics and platform insights
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * Get comprehensive platform analytics
 * @route GET /admin/analytics
 * @access Protected (admin only)
 * @returns {object} Analytics including:
 *   - totalUsers, activeUsers, activeSessions, completedSessions
 *   - topSkillsToTeach: Top 10 most taught skills
 *   - avgRating: Average peer rating across platform
 *   - monthlyGrowth: User signups per month (last 12 months)
 *   - sessionTrends: Breakdown of sessions by status
 */
const getDatabaseAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'student' });
    const activeUsers = await User.countDocuments({ status: 'active', role: 'student' });
    const activeSessions = await Session.countDocuments({ status: { $in: ['PENDING', 'ACCEPTED', 'ONGOING'] } });
    const completedSessions = await Session.countDocuments({ status: 'COMPLETED' });

    const topSkillsToTeach = await User.aggregate([
      { $unwind: '$skillsToTeach' },
      { $group: { _id: '$skillsToTeach', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Monthly growth (signups per month)
    const monthlyGrowth = await User.aggregate([
      { $match: { role: 'student' } },
      { $group: {
        _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
        count: { $sum: 1 }
      } },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 12 }
    ]);

    // Session trends (accepted vs completed vs pending)
    const sessionTrends = await Session.aggregate([
      { $group: {
        _id: "$status",
        count: { $sum: 1 }
      } }
    ]);

    const avgRatingResult = await User.aggregate([
      { $group: { _id: null, avg: { $avg: '$rating' } } }
    ]);
    const avgRating = avgRatingResult[0]?.avg?.toFixed(2) || 0;

    res.json({ 
      totalUsers, 
      activeUsers, 
      activeSessions, 
      completedSessions, 
      topSkillsToTeach, 
      avgRating,
      monthlyGrowth: monthlyGrowth.map(g => ({ month: `${g._id.year}-${g._id.month}`, count: g.count })),
      sessionTrends: sessionTrends.map(s => ({ status: s._id, count: s.count }))
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

/**
 * ═══════════════════════════════════════════════════════════════
 * USER MANAGEMENT ENDPOINTS - View, edit, and moderate students
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * Get all student accounts
 * @route GET /admin/users
 * @access Protected (admin only)
 * @returns {array} All student users sorted by creation date (newest first), without passwords
 */
// ─────────────────────────────────────────
// USER MANAGEMENT
// ─────────────────────────────────────────
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'student' }).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

/**
 * Get specific user by ID
 * @route GET /admin/users/:id
 * @access Protected (admin only)
 * @param {string} id - User ID
 * @returns {object} User profile without password
 * @throws 404 if user not found
 */
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

/**
 * Update user information
 * @route PUT /admin/users/:id
 * @access Protected (admin only)
 * @param {string} name - Student name (optional)
 * @param {array} skillsToTeach - Updated teaching skills (optional)
 * @param {array} skillsToLearn - Updated learning skills (optional)
 * @param {string} role - User role: 'student' or 'admin' (optional)
 * @param {string} status - Account status: 'active', 'blocked', 'banned' (optional)
 * @returns {object} Updated user without password
 */
const updateUser = async (req, res) => {
  try {
    const { name, skillsToTeach, skillsToLearn, role, status } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, skillsToTeach, skillsToLearn, role, status },
      { new: true, runValidators: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

/**
 * Delete user and associated sessions
 * @route DELETE /admin/users/:id
 * @access Protected (admin only)
 * @param {string} id - User ID to delete
 * @returns {object} {message: 'User and associated sessions deleted'}
 * @throws 404 if user not found
 * 
 * Side effects: Cascades to delete all sessions where user is teacher or learner
 */
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    // Clean up their sessions too
    await Session.deleteMany({ $or: [{ teacherId: req.params.id }, { learnerId: req.params.id }] });
    res.json({ message: 'User and associated sessions deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

/**
 * Toggle user blocked status
 * @route PATCH /admin/users/:id/block
 * @access Protected (admin only)
 * @param {string} id - User ID
 * @returns {object} Updated user with new status (blocked or active)
 * Blocks prevent user from login but aren't permanent
 */
const blockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.status = user.status === 'blocked' ? 'active' : 'blocked';
    await user.save();
    res.json({ message: `User ${user.status}`, status: user.status });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

/**
 * Permanently ban user from platform
 * @route PATCH /admin/users/:id/ban
 * @access Protected (admin only)
 * @param {string} id - User ID
 * @returns {object} {message: 'User permanently banned', user}
 * Bans prevent login and are irreversible without manual admin intervention
 */
const banUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { status: 'banned' }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User permanently banned', user });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

/**
 * ═══════════════════════════════════════════════════════════════
 * SESSION MANAGEMENT ENDPOINTS - Monitor and control learning sessions
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * Get all sessions with optional filtering by status
 * @route GET /admin/sessions?status=PENDING|ACCEPTED|ONGOING|COMPLETED|REJECTED
 * @access Protected (admin only)
 * @returns {array} Sessions sorted by creation date, with teacher/learner info
 */
// ─────────────────────────────────────────
// SESSION MANAGEMENT
// ─────────────────────────────────────────
const getAllSessions = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const sessions = await Session.find(filter)
      .populate('teacherId', 'name email')
      .populate('learnerId', 'name email')
      .sort({ createdAt: -1 });
    res.json(sessions);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

/**
 * Cancel/delete a session
 * @route DELETE /admin/sessions/:id
 * @access Protected (admin only)
 * @param {string} id - Session ID
 * @returns {object} {message: 'Session cancelled'}
 */
const deleteSession = async (req, res) => {
  try {
    const session = await Session.findByIdAndDelete(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.json({ message: 'Session cancelled' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

/**
 * Manually mark session as completed (admin override)
 * @route PATCH /admin/sessions/:id/force-complete
 * @access Protected (admin only)
 * @param {string} id - Session ID
 * @returns {object} Updated session with status COMPLETED
 * Used when students forget to mark session complete
 */
const forceCompleteSession = async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(
      req.params.id,
      { status: 'COMPLETED' },
      { new: true }
    ).populate('teacherId', 'name email').populate('learnerId', 'name email');
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.json(session);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

/**
 * ═══════════════════════════════════════════════════════════════
 * SYSTEM SETTINGS ENDPOINTS - Toggle platform features
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * Get current platform settings/feature flags
 * @route GET /admin/settings
 * @access Protected (admin only)
 * @returns {object} Settings object:
 *   - isRegistrationEnabled: Allow new student signups (default: true)
 *   - areSessionsEnabled: Allow session booking (default: true)
 *   - isAIEnabled: Enable AI learning roadmaps (default: false)
 */
// ─────────────────────────────────────────
// SYSTEM SETTINGS
// ─────────────────────────────────────────
const getSettings = async (req, res) => {
  try {
    const settings = await Setting.find({});
    // Convert array to object map for easier frontend consumption
    const settingsMap = settings.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), {});
    // Ensure default settings exist
    const defaults = { isRegistrationEnabled: true, areSessionsEnabled: true, isAIEnabled: false };
    res.json({ ...defaults, ...settingsMap });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

/**
 * Update platform settings/feature flags
 * @route PUT /admin/settings
 * @access Protected (admin only)
 * @param {boolean} isRegistrationEnabled - Allow new signups
 * @param {boolean} areSessionsEnabled - Allow session booking
 * @param {boolean} isAIEnabled - Enable AI features
 * @returns {object} {message: 'Settings updated', settings: updates}
 */
const updateSettings = async (req, res) => {
  try {
    const updates = req.body; // e.g. { isRegistrationEnabled: false }
    for (const [key, value] of Object.entries(updates)) {
      await Setting.findOneAndUpdate({ key }, { key, value }, { upsert: true });
    }
    res.json({ message: 'Settings updated', settings: updates });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = {
  getDatabaseAnalytics, getAllUsers, getUserById, updateUser,
  deleteUser, blockUser, banUser, getAllSessions, deleteSession,
  forceCompleteSession, getSettings, updateSettings
};
