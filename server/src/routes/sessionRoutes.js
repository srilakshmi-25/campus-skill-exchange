const express = require('express');
const router = express.Router();
const { createSessionRequest, updateSessionStatus, getMySessions } = require('../controllers/sessionController');
const { protect } = require('../middleware/authMiddleware');

router.post('/request', protect, createSessionRequest);
router.put('/update', protect, updateSessionStatus);
router.get('/my', protect, getMySessions);

module.exports = router;
