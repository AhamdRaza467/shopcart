const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { register, login, getMe, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Rate limiting for auth routes to prevent brute force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per `window` (here, per 15 minutes)
  message: { message: 'Too many requests from this IP, please try again after 15 minutes' }
});

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/me', protect, getMe);
router.post('/forgotpassword', authLimiter, forgotPassword);
router.put('/resetpassword/:token', authLimiter, resetPassword);

module.exports = router;
