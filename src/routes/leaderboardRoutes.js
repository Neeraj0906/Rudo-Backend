const express = require('express');
const router = express.Router();
const { getLeaderboard } = require('../controllers/tradeController'); // ✅ Ensure the path is correct

router.get('/leaderboard', getLeaderboard); // ✅ Leaderboard route

module.exports = router;
