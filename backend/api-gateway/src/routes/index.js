const express = require('express');
const proxy   = require('express-http-proxy');
const router  = express.Router();

const SERVICES = require('../config/services');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');
const { authLimiter, paymentLimiter } = require('../middleware/rateLimiter');

// ─── Helper: proxy to a service ──────────────────────────────────────────────
const proxyTo = (serviceUrl) => proxy(serviceUrl, {
  proxyReqPathResolver: (req) => req.originalUrl,
  proxyReqBodyDecorator: (bodyContent) => bodyContent,
  parseReqBody: true,
  proxyErrorHandler: (err, res, next) => {
    console.error(`[GATEWAY] Proxy error:`, err.message);
    res.status(503).json({
      success: false,
      message: 'Service temporarily unavailable. Please try again.',
    });
  },
});

// ─── PUBLIC ROUTES (no JWT needed) ───────────────────────────────────────────

// Auth routes — open to everyone (login, OTP)
router.use('/auth', authLimiter, proxyTo(SERVICES.auth));

// Gemini AI routes — open to everyone (chatbot for all users)
// ⭐ NEW: Add this line for Gemini AI service
router.use('/api/gemini', proxyTo(SERVICES.gemini));

// ─── PROTECTED ROUTES (JWT required) ─────────────────────────────────────────

// Citizen routes — any logged in user
router.use('/citizen',
  verifyToken,
  proxyTo(SERVICES.citizen)
);

// Electricity routes — citizen or electricity admin
router.use('/electricity',
  verifyToken,
  proxyTo(SERVICES.electricity)
);

// Gas routes
router.use('/gas',
  verifyToken,
  proxyTo(SERVICES.gas)
);

// Water routes
router.use('/water',
  verifyToken,
  proxyTo(SERVICES.water)
);

// Municipality routes
router.use('/municipality',
  verifyToken,
  proxyTo(SERVICES.municipality)
);

// Payment routes
router.use('/payment',
  verifyToken,
  paymentLimiter,
  proxyTo(SERVICES.payment)
);

// Grievance routes
router.use('/grievance',
  verifyToken,
  proxyTo(SERVICES.grievance)
);

// Notification routes
router.use('/notification',
  verifyToken,
  proxyTo(SERVICES.notification)
);


// ─── ADMIN ONLY ROUTES ────────────────────────────────────────────────────────

// Report/analytics — dept_admin and super_admin only
router.use('/report',
  verifyToken,
  requireRole(['dept_admin', 'super_admin']),
  proxyTo(SERVICES.report)
);


// ─── GATEWAY HEALTH CHECK ────────────────────────────────────────────────────
router.get('/health', (req, res) => {
  res.json({
    success: true,
    service: 'api-gateway',
    status:  'running',
    timestamp: new Date().toISOString(),
    services: {
      auth:         SERVICES.auth,
      citizen:      SERVICES.citizen,
      gemini:       SERVICES.gemini,          // ⭐ NEW: Add gemini service
      electricity:  SERVICES.electricity,
      gas:          SERVICES.gas,
      water:        SERVICES.water,
      municipality: SERVICES.municipality,
      payment:      SERVICES.payment,
      grievance:    SERVICES.grievance,
      notification: SERVICES.notification,
      report:       SERVICES.report,
    },
  });
});

module.exports = router;