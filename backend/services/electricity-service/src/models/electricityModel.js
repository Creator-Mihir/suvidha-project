const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// ─── Bills ────────────────────────────────────────────────────────────────────

const getBillByConnectionId = async (connectionId) => {
  const result = await pool.query(
    `SELECT * FROM bills 
     WHERE k_no = $1 AND status = 'unpaid'
     ORDER BY bill_date DESC LIMIT 1`,
    [connectionId]
  );
  return result.rows[0] || null;
};

const getPaymentHistory = async (userId) => {
  const result = await pool.query(
    `SELECT * FROM bills 
     WHERE user_id = $1 
     ORDER BY bill_date DESC LIMIT 10`,
    [userId]
  );
  return result.rows;
};

const markBillPaid = async (billId) => {
  await pool.query(
    `UPDATE bills SET status = 'paid' WHERE id = $1`,
    [billId]
  );
};

// ─── Complaints ───────────────────────────────────────────────────────────────

const createComplaint = async ({ userId, kNo, category, description }) => {
  const complaintNo = `TKT-${Date.now().toString().slice(-6)}`;
  const result = await pool.query(
    `INSERT INTO complaints (user_id, k_no, complaint_no, category, description, status)
     VALUES ($1, $2, $3, $4, $5, 'pending')
     RETURNING *`,
    [userId, kNo, complaintNo, category, description]
  );
  return result.rows[0];
};

const getComplaintsByUser = async (userId) => {
  const result = await pool.query(
    `SELECT * FROM complaints WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows;
};

const getComplaintByNo = async (complaintNo) => {
  const result = await pool.query(
    `SELECT * FROM complaints WHERE complaint_no = $1`,
    [complaintNo]
  );
  return result.rows[0] || null;
};

// ─── New Connection Requests ──────────────────────────────────────────────────

const createConnectionRequest = async ({ userId, applicantName, address, connectionType, load }) => {
  const appId = `APP-${Date.now().toString().slice(-6)}`;
  const result = await pool.query(
    `INSERT INTO new_connection_requests 
     (id, user_id, applicant_name, address, connection_type, status)
     VALUES ($1, $2, $3, $4, $5, 'pending')
     RETURNING *`,
    [uuidv4(), userId, applicantName, address, connectionType]
  );
  return { ...result.rows[0], applicationId: appId };
};

const getConnectionByK_No = async (kNo) => {
  const result = await pool.query(
    `SELECT * FROM connections WHERE k_no = $1`,
    [kNo]
  );
  return result.rows[0] || null;
};

module.exports = {
  getBillByConnectionId,
  getPaymentHistory,
  markBillPaid,
  createComplaint,
  getComplaintsByUser,
  getComplaintByNo,
  createConnectionRequest,
  getConnectionByK_No,
};