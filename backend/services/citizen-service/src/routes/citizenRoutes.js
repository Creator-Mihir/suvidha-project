const express = require('express');
const router  = express.Router();
const citizenController = require('../controllers/citizenController');

// All routes here are already JWT-verified by API Gateway
// req.headers['x-user-id'] is set by the gateway

// Profile
router.get('/profile',       citizenController.getProfile);
router.post('/profile/setup', citizenController.setupProfile);
router.put('/profile',        citizenController.updateProfile);

// Department connections
router.get('/connections',   citizenController.getConnections);
router.post('/connections',  citizenController.addConnection);

// Health check
router.get('/health', (req, res) => {
  res.json({ success: true, service: 'citizen-service', status: 'running' });
});

module.exports = router;