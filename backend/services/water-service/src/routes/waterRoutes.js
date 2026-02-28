const express = require('express');
const router  = express.Router();
const c       = require('../controllers/waterController');

router.get('/bill/:connectionId', c.getBill);
router.get('/connections',        c.getConnections);
router.get('/track/:refId',       c.trackStatus);
router.post('/payment',           c.payBill);
router.post('/complaint',         c.submitComplaint);
router.post('/new-connection',    c.applyNewConnection);
router.get('/health', (req, res) => res.json({ success: true, service: 'water-service', status: 'running' }));

module.exports = router;