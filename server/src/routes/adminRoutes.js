const express = require('express');
const router = express.Router();
const { protect, adminProtect } = require('../middleware/authMiddleware');
const {
  getDatabaseAnalytics, getAllUsers, getUserById, updateUser,
  deleteUser, blockUser, banUser, getAllSessions, deleteSession,
  forceCompleteSession, getSettings, updateSettings
} = require('../controllers/adminController');

// All admin routes are protected
router.use(protect, adminProtect);

// Analytics
router.get('/analytics', getDatabaseAnalytics);

// User management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id/block', blockUser);
router.patch('/users/:id/ban', banUser);

// Session management
router.get('/sessions', getAllSessions);
router.delete('/sessions/:id', deleteSession);
router.patch('/sessions/:id/force-complete', forceCompleteSession);

// System settings
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

module.exports = router;
