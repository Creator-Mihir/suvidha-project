require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');

const routes            = require('./routes/index');
const logger            = require('./middleware/logger');
const { generalLimiter } = require('./middleware/rateLimiter');

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── Security ─────────────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: (process.env.ALLOWED_ORIGINS || '').split(','),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Electricity-Token'],
    credentials: true,
}));

// ─── Body Parser ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));  // 10mb for document uploads
app.use(express.urlencoded({ extended: true }));

// ─── Logging & Rate Limiting ──────────────────────────────────────────────────
app.use(logger);
app.use(generalLimiter);

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/', routes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found.`,
  });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[GATEWAY ERROR]', err.message);
  res.status(500).json({
    success: false,
    message: 'Gateway error. Please try again.',
  });
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🌐 [API GATEWAY] Running on port ${PORT}`);
  console.log(`📋 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`\n📡 Routing table:`);
  console.log(`   /auth/*          → auth-service:3001`);
  console.log(`   /citizen/*       → citizen-service:3002`);
  console.log(`   /electricity/*   → electricity-service:3003`);
  console.log(`   /gas/*           → gas-service:3004`);
  console.log(`   /water/*         → water-service:3005`);
  console.log(`   /municipality/*  → municipality-service:3006`);
  console.log(`   /payment/*       → payment-service:3007`);
  console.log(`   /grievance/*     → grievance-service:3008`);
  console.log(`   /notification/*  → notification-service:3009`);
  console.log(`   /report/*        → report-service:3010\n`);
});

module.exports = app;