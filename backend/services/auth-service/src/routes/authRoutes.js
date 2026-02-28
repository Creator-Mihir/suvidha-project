const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/authController');
const { verifyToken } = require('../../../../shared/middleware/authMiddleware');

// ─── Rate Limiters ────────────────────────────────────────────────────────────

// OTP requests: max 5 per 15 minutes per IP
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { success: false, message: 'Too many OTP requests. Please wait 15 minutes.' },
  standardHeaders: true,
});

// Login attempts: max 10 per 15 minutes per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many login attempts. Please wait 15 minutes.' },
});

// ─── Routes ───────────────────────────────────────────────────────────────────

// Citizen OTP flow
router.post('/otp/request', otpLimiter, authController.requestOTP);
router.post('/otp/verify',  otpLimiter, authController.verifyOTP);

// Admin password flow
router.post('/login', loginLimiter, authController.loginWithPassword);

// Token verification (called by API Gateway)
router.get('/verify', verifyToken, authController.verifyTokenEndpoint);

// Logout
router.post('/logout', verifyToken, authController.logout);

// Health check
router.get('/health', (req, res) => {
  res.json({ success: true, service: 'auth-service', status: 'running', timestamp: new Date().toISOString() });
});

module.exports = router;