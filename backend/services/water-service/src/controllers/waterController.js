const dummy = require('../config/dummyClient');
const pool  = require('../config/db');

const getBill = async (req, res) => {
  try {
    const data = await dummy.getDummyBill(req.params.connectionId);
    res.json({ success: true, data });
  } catch { res.status(500).json({ success: false, message: 'Failed to fetch bill.' }); }
};

const getConnections = async (req, res) => {
  try {
    const connections = await dummy.getDummyConnections(req.headers['x-user-id']);
    res.json({ success: true, data: { connections } });
  } catch { res.status(500).json({ success: false, message: 'Failed to fetch connections.' }); }
};

const payBill = async (req, res) => {
  try {
    const { connectionId, amount, paymentMethod } = req.body;
    if (!connectionId || !amount) return res.status(400).json({ success: false, message: 'Connection ID and amount required.' });
    const result = await dummy.submitDummyPayment(connectionId, amount, paymentMethod);
    res.json({ success: true, message: result.message, data: { transactionId: result.transactionId } });
  } catch { res.status(500).json({ success: false, message: 'Payment failed.' }); }
};

const submitComplaint = async (req, res) => {
  try {
    const { connectionId, category, description } = req.body;
    if (!connectionId || !category) return res.status(400).json({ success: false, message: 'All fields required.' });
    const ticketId = `WTR-CMP-${Date.now().toString().slice(-6)}`;
    await pool.query(
      `INSERT INTO complaints (user_id, connection_id, ticket_no, category, description, status) VALUES ($1, $2, $3, $4, $5, 'pending')`,
      [req.headers['x-user-id'], connectionId, ticketId, category, description || '']
    ).catch(() => {});
    await dummy.submitDummyComplaint(req.body);
    res.json({ success: true, message: `Complaint registered. Ticket: ${ticketId}`, data: { ticketId } });
  } catch { res.status(500).json({ success: false, message: 'Failed to submit complaint.' }); }
};

const applyNewConnection = async (req, res) => {
  try {
    const { applicantName, mobile, address } = req.body;
    if (!applicantName || !address) return res.status(400).json({ success: false, message: 'Required fields missing.' });
    const result = await dummy.submitDummyNewConnection(req.body);
    await pool.query(
      `INSERT INTO new_connection_requests (user_id, applicant_name, address, status) VALUES ($1, $2, $3, 'pending')`,
      [req.headers['x-user-id'], applicantName, address]
    ).catch(() => {});
    res.json({ success: true, message: result.message, data: { ticketId: result.ticketId } });
  } catch { res.status(500).json({ success: false, message: 'Failed to submit application.' }); }
};

const trackStatus = async (req, res) => {
  try {
    const data = await dummy.getDummyTrackingStatus(req.params.refId);
    res.json({ success: true, data });
  } catch { res.status(500).json({ success: false, message: 'Failed to fetch status.' }); }
};

module.exports = { getBill, getConnections, payBill, submitComplaint, applyNewConnection, trackStatus };