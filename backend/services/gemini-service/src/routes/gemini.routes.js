// ─── Gemini AI Routes ───────────────────────────────────────────────────────
// Location: backend/gemini-service/src/routes/gemini.routes.js
// Defines API endpoints for Gemini AI microservice

const express = require('express');
const router = express.Router();
const { chatWithAI, healthCheck } = require('../controllers/gemini.controller');

// POST /api/gemini/chat - Send message to AI
router.post('/chat', chatWithAI);

// GET /api/gemini/health - Health check
router.get('/health', healthCheck);

module.exports = router;