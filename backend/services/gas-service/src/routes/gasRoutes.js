const express = require('express');
const router  = express.Router();
const c       = require('../controllers/gasController');

router.get('/bill/:connectionId',        c.getBill);
router.get('/connections',               c.getConnections);
router.get('/consumption/:connectionId', c.getConsumption);
router.get('/track/:refId',              c.trackStatus);
router.post('/payment',                  c.payBill);
router.post('/cylinder-booking',         c.bookCylinder);
router.post('/complaint',                c.submitComplaint);
router.post('/new-connection',           c.applyNewConnection);
router.get('/health', (req, res) => res.json({ success: true, service: 'gas-service', status: 'running' }));

module.exports = router;