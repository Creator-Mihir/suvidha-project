// ─── Gemini AI Controller ────────────────────────────────────────────────────
// Location: backend/gemini-service/src/controllers/gemini.controller.js
// Handles incoming HTTP requests and responses

const { sendToGemini, getQuickReplies } = require('../services/gemini.service');

// POST /api/gemini/chat
const chatWithAI = async (req, res) => {
  try {
    const { userMessage, conversationHistory = [] } = req.body;

    // Validate input
    if (!userMessage || userMessage.trim() === '') {
      return res.status(400).json({ 
        success: false,
        error: 'userMessage is required and cannot be empty' 
      });
    }

    console.log(`[Gemini Controller] Chat request received`);
    console.log(`[Gemini Controller] User message: "${userMessage.substring(0, 50)}..."`);

    // Send to Gemini
    const reply = await sendToGemini(userMessage, conversationHistory);

    // Get quick reply suggestions based on the response
    const quickReplies = getQuickReplies(reply);

    console.log(`[Gemini Controller] Response sent successfully`);

    return res.status(200).json({
      success: true,
      data: {
        reply,
        quickReplies,
      },
    });
  } catch (error) {
    console.error('[Gemini Controller] Error:', error.message);
    
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate response from Gemini AI',
    });
  }
};

// GET /api/gemini/health
const healthCheck = (req, res) => {
  res.status(200).json({
    success: true,
    service: 'gemini-ai',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
};

module.exports = {
  chatWithAI,
  healthCheck,
};