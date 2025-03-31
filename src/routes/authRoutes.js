const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const { authenticateUser } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected Route Example
router.get('/protected', authenticateUser, (req, res) => {
  try {
    res.json({ message: 'This is a protected route', userId: req.userId });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


module.exports = router;
