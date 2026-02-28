const dummy   = require('../config/dummyClient');
const model   = require('../models/electricityModel');

// ─── Get Bill ─────────────────────────────────────────────────────────────────

/**
 * GET /electricity/bill/:connectionId
 * Called when user enters connection ID in BillPayment.jsx
 */
const getBill = async (req, res) => {
  try {
    const { connectionId } = req.params;
    const userId = req.headers['x-user-id'];

    if (!connectionId) {
      return res.status(400).json({ success: false, message: 'Connection ID required.' });
    }

    const billData = await dummy.getDummyBill(connectionId);

    return res.status(200).json({
      success: true,
      data: billData,
    });
  } catch (err) {
    console.error('[ELEC] getBill error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch bill.' });
  }
};

// ─── Get Saved Connections ────────────────────────────────────────────────────

/**
 * GET /electricity/connections
 * Returns saved connection IDs for logged-in citizen (shown in BillPayment sidebar)
 */
const getSavedConnections = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const connections = await dummy.getDummyConnections(userId);

    return res.status(200).json({
      success: true,
      data: { connections },
    });
  } catch (err) {
    console.error('[ELEC] getSavedConnections error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch connections.' });
  }
};

// ─── Pay Bill ─────────────────────────────────────────────────────────────────

/**
 * POST /electricity/payment
 * Called when user clicks "Pay Current Bill" in BillPayment.jsx
 * Body: { connectionId, amount, paymentMethod }
 */
const payBill = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const { connectionId, amount, paymentMethod = 'kiosk' } = req.body;

    if (!connectionId || !amount) {
      return res.status(400).json({ success: false, message: 'Connection ID and amount required.' });
    }

    const result = await dummy.submitDummyPayment(connectionId, amount, paymentMethod);

    return res.status(200).json({
      success: true,
      message: result.message,
      data: {
        transactionId: result.transactionId,
        receiptId:     result.receiptId,
        amount,
        connectionId,
      },
    });
  } catch (err) {
    console.error('[ELEC] payBill error:', err.message);
    return res.status(500).json({ success: false, message: 'Payment failed. Please try again.' });
  }
};

// ─── Submit Complaint ─────────────────────────────────────────────────────────

/**
 * POST /electricity/complaint
 * Called when user submits form in Complaints.jsx
 * Body: { connectionId, category, description }
 */
const submitComplaint = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const { connectionId, category, description } = req.body;

    if (!connectionId || !category || !description) {
      return res.status(400).json({
        success: false,
        message: 'Connection ID, category and description are required.',
      });
    }

    // Save to our DB
    const complaint = await model.createComplaint({
      userId,
      kNo: connectionId,
      category,
      description,
    });

    // Also notify dummy server
    await dummy.submitDummyComplaint({ connectionId, category, description });

    return res.status(200).json({
      success: true,
      message: `Complaint registered successfully.`,
      data: {
        ticketId:  complaint.complaint_no,
        status:    complaint.status,
        message:   `Ticket ID: ${complaint.complaint_no}. Technician will visit in 24-48 hours.`,
      },
    });
  } catch (err) {
    console.error('[ELEC] submitComplaint error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to submit complaint.' });
  }
};

// ─── New Connection Application ───────────────────────────────────────────────

/**
 * POST /electricity/new-connection
 * Called when user submits form in NewConnection.jsx
 */
const applyNewConnection = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const { fullName, fatherName, mobile, address, connectionType, load } = req.body;

    if (!fullName || !address || !connectionType) {
      return res.status(400).json({ success: false, message: 'All required fields must be filled.' });
    }

    // Save to our DB
    const application = await model.createConnectionRequest({
      userId,
      applicantName: fullName,
      address,
      connectionType,
      load,
    });

    // Notify dummy server
    await dummy.submitDummyNewConnection({ fullName, address, connectionType });

    return res.status(200).json({
      success: true,
      message: 'Application submitted successfully.',
      data: {
        applicationId: application.applicationId,
        message: `Ref ID: ${application.applicationId}. Verification pending. You will be contacted within 3-5 working days.`,
      },
    });
  } catch (err) {
    console.error('[ELEC] applyNewConnection error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to submit application.' });
  }
};

// ─── Track Status ─────────────────────────────────────────────────────────────

/**
 * GET /electricity/track/:refId
 * Called from Tracking.jsx when user enters ref/ticket ID
 */
const trackStatus = async (req, res) => {
  try {
    const { refId } = req.params;

    if (!refId) {
      return res.status(400).json({ success: false, message: 'Reference ID required.' });
    }

    // Check our DB first for complaints
    const complaint = await model.getComplaintByNo(refId).catch(() => null);

    if (complaint) {
      return res.status(200).json({
        success: true,
        data: {
          refId,
          type:          'complaint',
          currentStatus: complaint.status,
          steps: [
            { label: 'Complaint Registered', status: 'completed', time: new Date(complaint.created_at).toLocaleString() },
            { label: 'Under Review',          status: complaint.status !== 'pending' ? 'completed' : 'active', time: '' },
            { label: 'In Progress',           status: complaint.status === 'in_progress' ? 'active' : complaint.status === 'resolved' ? 'completed' : 'pending', time: '' },
            { label: 'Resolved',              status: complaint.status === 'resolved' ? 'completed' : 'pending', time: complaint.resolved_at ? new Date(complaint.resolved_at).toLocaleString() : 'Pending' },
          ],
        },
      });
    }

    // Fallback to dummy server tracking
    const tracking = await dummy.getDummyTrackingStatus(refId);
    return res.status(200).json({ success: true, data: tracking });

  } catch (err) {
    console.error('[ELEC] trackStatus error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch status.' });
  }
};

// ─── Payment History ──────────────────────────────────────────────────────────

/**
 * GET /electricity/history
 * Returns past payment records for the citizen
 */
const getHistory = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const history = await model.getPaymentHistory(userId);

    return res.status(200).json({
      success: true,
      data: { history },
    });
  } catch (err) {
    console.error('[ELEC] getHistory error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch history.' });
  }
};

module.exports = {
  getBill,
  getSavedConnections,
  payBill,
  submitComplaint,
  applyNewConnection,
  trackStatus,
  getHistory,
};