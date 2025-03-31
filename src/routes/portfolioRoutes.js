const express = require("express");
const { authenticateUser, getPortfolio, getLeaderboard } = require("../controllers/tradeController");

const router = express.Router();

// Route to fetch user's portfolio
router.get("/:userId", authenticateUser, getPortfolio);

// Route to fetch leaderboard
router.get("/leaderboard", getLeaderboard);

module.exports = router;
