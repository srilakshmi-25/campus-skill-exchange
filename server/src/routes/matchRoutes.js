const express = require('express');
const router = express.Router();
const { getMatches, fetchRoadmap } = require('../controllers/matchController');
const { protect } = require('../middleware/authMiddleware');

router.get('/suggestions', protect, getMatches);
router.post('/roadmap', protect, fetchRoadmap);

module.exports = router;
