const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/electricityController');

// All routes JWT-verified by API Gateway
// req.headers['x-user-id'] already set

router.get('/bill/:connectionId',  controller.getBill);
router.get('/connections',         controller.getSavedConnections);
router.get('/history',             controller.getHistory);
router.get('/track/:refId',        controller.trackStatus);

router.post('/payment',            controller.payBill);
router.post('/complaint',          controller.submitComplaint);
router.post('/new-connection',     controller.applyNewConnection);

router.get('/health', (req, res) => {
  res.json({ success: true, service: 'electricity-service', status: 'running' });
});

module.exports = router;