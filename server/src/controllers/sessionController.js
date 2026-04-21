/**
 * Session Controller
 * Manages peer learning session lifecycle: request, accept, complete, reject
 * Handles notifications when session status changes
 */

const Session = require('../models/Session');
const User = require('../models/User');
const Notification = require('../models/Notification');

/**
 * Create new session request between two peers
 * @route POST /session/request
 * @access Protected (requires JWT token)
 * @param {string} partnerId - ID of peer to request session with
 * @param {string} skill - Skill topic for the session
 * @param {string} role - 'learner' or 'teacher' (current user's perspective)
 * @returns {object} Created session document
 * Creates notification to alert partner of incoming request
 */
const createSessionRequest = async (req, res) => {
  try {
    const { partnerId, skill, role } = req.body; // role: 'learner' or 'teacher' from current user's perspective

    let teacherId, learnerId;
    if (role === 'learner') {
      learnerId = req.user._id;
      teacherId = partnerId;
    } else {
      teacherId = req.user._id;
      learnerId = partnerId;
    }

    const session = await Session.create({
      teacherId,
      learnerId,
      skill,
      status: 'PENDING'
    });

    // Notify partner
    await Notification.create({
      recipient: partnerId,
      sender: req.user._id,
      type: 'session',
      message: `${req.user.name} requested a ${skill} session with you.`,
      link: '/dashboard/sessions'
    });

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update session status through its lifecycle
 * @route PUT /session/update
 * @access Protected (requires JWT token)
 * @param {string} sessionId - Session MongoDB ObjectId
 * @param {string} status - New status: ACCEPTED, ONGOING, REJECTED, or COMPLETED
 * @returns {object} Updated session document
 * Valid transitions: PENDING → ACCEPTED, REJECTED, ONGOING → COMPLETED
 * Notifies both teacher and learner of status changes
 */
const updateSessionStatus = async (req, res) => {
  try {
    const { sessionId, status } = req.body;
    
    // Ensure status is valid
    if (!['ACCEPTED', 'ONGOING', 'REJECTED', 'COMPLETED'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const session = await Session.findById(sessionId).populate('teacherId learnerId');
    if (!session) return res.status(404).json({ message: 'Session not found' });

    session.status = status;
    await session.save();

    // Notify the other party
    const isCurrentUserTeacher = session.teacherId._id.toString() === req.user._id.toString();
    const recipientId = isCurrentUserTeacher ? session.learnerId._id : session.teacherId._id;
    
    let msg = `Session status updated to ${status} by ${req.user.name}.`;
    if (status === 'ACCEPTED') msg = `${req.user.name} accepted your session request!`;
    if (status === 'COMPLETED') msg = `${req.user.name} marked the session as completed.`;

    await Notification.create({
      recipient: recipientId,
      sender: req.user._id,
      type: 'session',
      message: msg,
      link: '/dashboard/sessions'
    });

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Retrieve all sessions for authenticated user
 * @route GET /session/my
 * @access Protected (requires JWT token)
 * @returns {array} Sessions where user is teacher OR learner, sorted newest first
 * Populated with teacher/learner details for display
 */
const getMySessions = async (req, res) => {
  try {
    const sessions = await Session.find({
      $or: [{ teacherId: req.user._id }, { learnerId: req.user._id }]
    })
    .populate('teacherId', 'name email rating')
    .populate('learnerId', 'name email rating')
    .sort({ createdAt: -1 });
    
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createSessionRequest, updateSessionStatus, getMySessions };
