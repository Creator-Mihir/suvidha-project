// ─── Gemini AI Microservice ──────────────────────────────────────────────────
// Location: backend/gemini-service/src/server.js
// Runs independently on its own port (e.g., 5008)
// Connected to API Gateway via routes

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ─── Routes ───────────────────────────────────────────────────────────────────
const geminiRoutes = require('./routes/gemini.routes');

app.use('/api/gemini', geminiRoutes);

// Health check endpoint (for API Gateway)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    service: 'gemini-service',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Route not found' 
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('[Error]', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.GEMINI_SERVICE_PORT || 5008;
app.listen(PORT, () => {
  console.log(`\n╔════════════════════════════════════════╗`);
  console.log(`║ 🤖 Gemini AI Microservice            ║`);
  console.log(`║ Running on port: ${PORT}${' '.repeat(PORT.toString().length >= 3 ? 15 : 16)}║`);
  console.log(`║ Status: Ready to process requests    ║`);
  console.log(`╚════════════════════════════════════════╝\n`);
});

module.exports = app;