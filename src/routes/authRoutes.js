const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const { authenticateUser } = require('../middlewares/authMiddleware');

const router = express.Router();

// Public routes
router.post('/register', registerUser); // Register a new user
router.post('/login', loginUser);       // Login an existing user

router.get('/protected', authenticateUser, (req, res) => {
  res.json({ message: 'This is a protected route', userId: req.userId });
});

module.exports = router;