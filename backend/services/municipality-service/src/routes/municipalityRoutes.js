const express = require('express');
const router  = express.Router();
const c       = require('../controllers/municipalityController');

router.get('/properties',          c.getProperties);
router.get('/track/:refId',        c.trackStatus);
router.post('/property-tax',       c.payPropertyTax);
router.post('/certificate',        c.applyCertificate);
router.post('/complaint',          c.submitComplaint);
router.post('/building-approval',  c.applyBuildingApproval);
router.post('/trade-license',      c.applyTradeLicense);
router.get('/health', (req, res) => res.json({ success: true, service: 'municipality-service', status: 'running' }));

module.exports = router;