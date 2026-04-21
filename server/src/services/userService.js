const Session = require('../models/Session');
const Rating = require('../models/Rating');

const computeUserStats = async (user) => {
  const completedSessions = await Session.countDocuments({ 
    teacherId: user._id, 
    status: 'COMPLETED' 
  });
  
  const totalRatings = await Rating.countDocuments({ toUserId: user._id });
  
  // A student is a mentor if they can teach AND have some teaching activity
  const isMentor = user.skillsToTeach.length > 0 && (completedSessions > 0 || totalRatings > 0);
  
  return {
    isMentor,
    stats: {
      completedSessions,
      totalRatings,
      avgRating: user.rating,
      trustScore: user.trustScore
    }
  };
};

module.exports = { computeUserStats };
