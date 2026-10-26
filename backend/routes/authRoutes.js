const express = require('express');
const router = express.Router();
const {
  registrationController,
  loginController,
  verificationTokenController,
  refreshController,
  logoutController,
  getMeController,
  forgotPasswordController,
  resetPasswordController,
} = require('../controller/authController');
const { protect } = require('../middleware/authMiddleware');
const { authLimiter, passwordResetLimiter } = require('../middleware/rateLimitMiddleware');

// Apply stricter rate limiting to authentication endpoints
router.post('/registration', authLimiter, registrationController);
router.post('/register', authLimiter, registrationController); // alias
router.get('/verify/:token', verificationTokenController);
router.post('/login', authLimiter, loginController);
router.post('/refresh', refreshController);
router.post('/logout', logoutController);
router.get('/me', protect, getMeController);
router.post('/forgot-password', passwordResetLimiter, forgotPasswordController);
router.post('/reset-password/:token', passwordResetLimiter, resetPasswordController);

module.exports = router;
