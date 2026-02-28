const express = require('express');
const router  = express.Router();
const c       = require('../controllers/paymentController');

router.post('/initiate',        c.initiatePayment);
router.post('/confirm',         c.confirmPayment);
router.get('/history',          c.getHistory);
router.get('/receipt/:txnId',   c.getReceipt);

router.get('/health', (req, res) => res.json({
  success: true,
  service: 'payment-service',
  gateway: process.env.PAYMENT_GATEWAY || 'mock',
  status: 'running',
}));

module.exports = router;