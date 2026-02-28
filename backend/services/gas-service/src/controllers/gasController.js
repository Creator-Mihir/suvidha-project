const dummy = require('../config/dummyClient');
const pool  = require('../config/db');

const getBill = async (req, res) => {
  try {
    const data = await dummy.getDummyBill(req.params.connectionId);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch bill.' });
  }
};

const getConnections = async (req, res) => {
  try {
    const connections = await dummy.getDummyConnections(req.headers['x-user-id']);
    res.json({ success: true, data: { connections } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch connections.' });
  }
};

const getConsumption = async (req, res) => {
  try {
    const data = await dummy.getDummyConsumption(req.params.connectionId);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch consumption.' });
  }
};

const payBill = async (req, res) => {
  try {
    const { connectionId, amount } = req.body;
    if (!connectionId || !amount) return res.status(400).json({ success: false, message: 'Connection ID and amount required.' });
    const result = await dummy.submitDummyPayment(connectionId, amount);
    res.json({ success: true, message: result.message, data: { transactionId: result.transactionId, amount, connectionId } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Payment failed.' });
  }
};

const bookCylinder = async (req, res) => {
  try {
    const { connectionId } = req.body;
    if (!connectionId) return res.status(400).json({ success: false, message: 'Connection ID required.' });
    const result = await dummy.submitDummyCylinderBooking(connectionId);

    // Save to DB
    await pool.query(
      `INSERT INTO cylinder_bookings (user_id, connection_id, booking_ref, status) VALUES ($1, $2, $3, 'pending')`,
      [req.headers['x-user-id'], connectionId, result.bookingId]
    ).catch(() => {});

    res.json({ success: true, message: result.message, data: { bookingId: result.bookingId } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Booking failed.' });
  }
};

const submitComplaint = async (req, res) => {
  try {
    const { connectionId, category, description } = req.body;
    if (!connectionId || !category || !description) return res.status(400).json({ success: false, message: 'All fields required.' });

    // Save to DB
    const ticketId = `TKT${Date.now().toString().slice(-6)}`;
    await pool.query(
      `INSERT INTO complaints (user_id, connection_id, ticket_no, category, description, status) VALUES ($1, $2, $3, $4, $5, 'pending')`,
      [req.headers['x-user-id'], connectionId, ticketId, category, description]
    ).catch(() => {});

    await dummy.submitDummyComplaint({ connectionId, category, description });
    res.json({ success: true, message: `Complaint filed. Ticket: ${ticketId}. Resolution in 24 hours.`, data: { ticketId } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to submit complaint.' });
  }
};

const applyNewConnection = async (req, res) => {
  try {
    const { fullName, mobile, connectionType, idProof, address } = req.body;
    if (!fullName || !address) return res.status(400).json({ success: false, message: 'Required fields missing.' });
    const result = await dummy.submitDummyNewConnection(req.body);

    await pool.query(
      `INSERT INTO new_connection_requests (user_id, applicant_name, address, connection_type, status) VALUES ($1, $2, $3, $4, 'pending')`,
      [req.headers['x-user-id'], fullName, address, connectionType || 'Domestic']
    ).catch(() => {});

    res.json({ success: true, message: result.message, data: { applicationId: result.applicationId } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to submit application.' });
  }
};

const trackStatus = async (req, res) => {
  try {
    const tracking = await dummy.getDummyTrackingStatus(req.params.refId);
    res.json({ success: true, data: tracking });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch status.' });
  }
};

module.exports = { getBill, getConnections, getConsumption, payBill, bookCylinder, submitComplaint, applyNewConnection, trackStatus };