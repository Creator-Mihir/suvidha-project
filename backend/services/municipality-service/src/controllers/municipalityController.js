const dummy = require('../config/dummyClient');
const pool  = require('../config/db');

const getProperties = async (req, res) => {
  try {
    const properties = await dummy.getDummyProperties(req.headers['x-user-id']);
    res.json({ success: true, data: { properties } });
  } catch { res.status(500).json({ success: false, message: 'Failed to fetch properties.' }); }
};

const payPropertyTax = async (req, res) => {
  try {
    const { propertyId, amount, period } = req.body;
    if (!propertyId || !amount) return res.status(400).json({ success: false, message: 'Property ID and amount required.' });
    const result = await dummy.submitDummyPropertyTax(req.body);
    await pool.query(
      `INSERT INTO property_tax_payments (user_id, property_id, amount, period, receipt_no, status) VALUES ($1, $2, $3, $4, $5, 'paid')`,
      [req.headers['x-user-id'], propertyId, amount, period || 'full-year', result.receiptId]
    ).catch(() => {});
    res.json({ success: true, message: result.message, data: { receiptId: result.receiptId } });
  } catch { res.status(500).json({ success: false, message: 'Payment failed.' }); }
};

const applyCertificate = async (req, res) => {
  try {
    const { certificateType, fields } = req.body;
    if (!certificateType) return res.status(400).json({ success: false, message: 'Certificate type required.' });
    const result = await dummy.submitDummyCertificate(req.body);
    await pool.query(
      `INSERT INTO certificate_applications (user_id, certificate_type, application_no, status) VALUES ($1, $2, $3, 'pending')`,
      [req.headers['x-user-id'], certificateType, result.applicationId]
    ).catch(() => {});
    res.json({ success: true, message: result.message, data: { applicationId: result.applicationId } });
  } catch { res.status(500).json({ success: false, message: 'Failed to submit application.' }); }
};

const submitComplaint = async (req, res) => {
  try {
    const { category, location, mobile, description } = req.body;
    if (!category || !location) return res.status(400).json({ success: false, message: 'Category and location required.' });
    const result = await dummy.submitDummyComplaint(req.body);
    await pool.query(
      `INSERT INTO complaints (user_id, category, location, description, ticket_no, status) VALUES ($1, $2, $3, $4, $5, 'pending')`,
      [req.headers['x-user-id'], category, location, description || '', result.ticketId]
    ).catch(() => {});
    res.json({ success: true, message: result.message, data: { ticketId: result.ticketId } });
  } catch { res.status(500).json({ success: false, message: 'Failed to submit complaint.' }); }
};

const applyBuildingApproval = async (req, res) => {
  try {
    const { applicantName, address } = req.body;
    if (!applicantName || !address) return res.status(400).json({ success: false, message: 'Required fields missing.' });
    const result = await dummy.submitDummyBuildingApproval(req.body);
    await pool.query(
      `INSERT INTO building_approval_requests (user_id, applicant_name, address, application_no, status) VALUES ($1, $2, $3, $4, 'pending')`,
      [req.headers['x-user-id'], applicantName, address, result.applicationId]
    ).catch(() => {});
    res.json({ success: true, message: result.message, data: { applicationId: result.applicationId } });
  } catch { res.status(500).json({ success: false, message: 'Failed to submit application.' }); }
};

const applyTradeLicense = async (req, res) => {
  try {
    const { ownerName, businessName, address } = req.body;
    if (!ownerName || !businessName) return res.status(400).json({ success: false, message: 'Required fields missing.' });
    const result = await dummy.submitDummyTradeLicense(req.body);
    await pool.query(
      `INSERT INTO trade_license_applications (user_id, owner_name, business_name, address, application_no, status) VALUES ($1, $2, $3, $4, $5, 'pending')`,
      [req.headers['x-user-id'], ownerName, businessName, address || '', result.applicationId]
    ).catch(() => {});
    res.json({ success: true, message: result.message, data: { applicationId: result.applicationId } });
  } catch { res.status(500).json({ success: false, message: 'Failed to submit application.' }); }
};

const trackStatus = async (req, res) => {
  try {
    const data = await dummy.getDummyTrackingStatus(req.params.refId);
    res.json({ success: true, data });
  } catch { res.status(500).json({ success: false, message: 'Failed to fetch status.' }); }
};

module.exports = { getProperties, payPropertyTax, applyCertificate, submitComplaint, applyBuildingApproval, applyTradeLicense, trackStatus };