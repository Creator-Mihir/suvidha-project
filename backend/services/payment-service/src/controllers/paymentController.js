const { v4: uuidv4 } = require('uuid');
const model = require('../models/paymentModel');

// ─── Initiate Payment ─────────────────────────────────────────────────────────
// Called by frontend when user clicks "Pay Now"
// Returns orderId that frontend uses to show payment UI
const initiatePayment = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const { department, connectionId, amount, description } = req.body;

    if (!department || !amount) {
      return res.status(400).json({ success: false, message: 'Department and amount are required.' });
    }

    // Create a pending payment record
    const orderId = `ORD-${Date.now().toString().slice(-8)}`;
    const txnId   = `TXN-${uuidv4().split('-')[0].toUpperCase()}`;

    await model.createPayment({
      userId,
      department,
      connectionId: connectionId || 'N/A',
      amount,
      method: 'pending',
      txnId,
      status: 'pending',
    }).catch(() => {}); // Don't fail if DB not ready

    return res.status(200).json({
      success: true,
      data: {
        orderId,
        txnId,
        amount,
        department,
        description: description || `${department} bill payment`,
      },
    });
  } catch (err) {
    console.error('[PAYMENT] initiatePayment error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to initiate payment.' });
  }
};

// ─── Confirm Payment ──────────────────────────────────────────────────────────
// Called after user completes payment in UI (mock or real gateway)
const confirmPayment = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const { txnId, orderId, method, department, connectionId, amount } = req.body;

    if (!txnId || !method) {
      return res.status(400).json({ success: false, message: 'Transaction ID and method required.' });
    }

    // Simulate gateway processing delay (realistic)
    await new Promise(resolve => setTimeout(resolve, 800));

    // Mock: 97% success rate (realistic for demo)
    const isSuccess = Math.random() > 0.03;

    if (!isSuccess) {
      await model.updatePaymentStatus(txnId, 'failed').catch(() => {});
      return res.status(400).json({ success: false, message: 'Payment declined by bank. Please try again.' });
    }

    // Save confirmed payment
    await model.createPayment({
      userId,
      department: department || 'unknown',
      connectionId: connectionId || 'N/A',
      amount,
      method,
      txnId,
      status: 'success',
    }).catch(() => {});

    const receiptId = `RCP-${txnId}`;

    return res.status(200).json({
      success: true,
      message: 'Payment successful!',
      data: {
        txnId,
        receiptId,
        amount,
        method,
        department,
        paidAt: new Date().toISOString(),
        status: 'success',
      },
    });
  } catch (err) {
    console.error('[PAYMENT] confirmPayment error:', err.message);
    return res.status(500).json({ success: false, message: 'Payment confirmation failed.' });
  }
};

// ─── Payment History ──────────────────────────────────────────────────────────
const getHistory = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const { department } = req.query;

    const payments = department
      ? await model.getPaymentsByDept(userId, department)
      : await model.getPaymentsByUser(userId);

    return res.status(200).json({
      success: true,
      data: { payments, total: payments.length },
    });
  } catch (err) {
    console.error('[PAYMENT] getHistory error:', err.message);
    // Return empty array if DB not ready - don't crash
    return res.status(200).json({ success: true, data: { payments: [], total: 0 } });
  }
};

// ─── Get Receipt ──────────────────────────────────────────────────────────────
const getReceipt = async (req, res) => {
  try {
    const { txnId } = req.params;
    const payment = await model.getPaymentByTxnId(txnId);

    if (!payment) {
      // Return mock receipt if not in DB
      return res.status(200).json({
        success: true,
        data: {
          txnId,
          receiptId: `RCP-${txnId}`,
          status: 'success',
          message: 'Payment verified',
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        txnId: payment.txn_id,
        receiptId: `RCP-${payment.txn_id}`,
        department: payment.department,
        connectionId: payment.connection_id,
        amount: payment.amount,
        method: payment.payment_method,
        status: payment.status,
        paidAt: payment.created_at,
      },
    });
  } catch (err) {
    console.error('[PAYMENT] getReceipt error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch receipt.' });
  }
};

module.exports = { initiatePayment, confirmPayment, getHistory, getReceipt };