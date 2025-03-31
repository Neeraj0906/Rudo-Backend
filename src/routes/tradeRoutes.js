const express = require('express');
const { authenticateUser } = require('../middlewares/authMiddleware');
const { buyStock, sellStock, getPortfolio } = require('../controllers/tradeController');

const router = express.Router();

// Protected routes
router.post('/buy', authenticateUser, buyStock); // Place a BUY order
router.post('/sell', authenticateUser, sellStock); // Place a SELL order
router.get('/portfolio/:userId', authenticateUser, getPortfolio); // Fetch user's portfolio

module.exports = router;
