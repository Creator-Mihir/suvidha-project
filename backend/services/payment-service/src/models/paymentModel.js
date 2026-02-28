const pool = require('../config/db');

// Create a new payment record
const createPayment = async ({ userId, department, connectionId, amount, method, txnId, status }) => {
  const result = await pool.query(
    `INSERT INTO payments 
     (user_id, department, connection_id, amount, payment_method, txn_id, status, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
     RETURNING *`,
    [userId, department, connectionId, amount, method, txnId, status]
  );
  return result.rows[0];
};

// Update payment status (for when real gateway webhook arrives)
const updatePaymentStatus = async (txnId, status) => {
  const result = await pool.query(
    `UPDATE payments SET status = $1, updated_at = NOW() WHERE txn_id = $2 RETURNING *`,
    [status, txnId]
  );
  return result.rows[0];
};

// Get all payments for a user
const getPaymentsByUser = async (userId) => {
  const result = await pool.query(
    `SELECT * FROM payments WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows;
};

// Get single payment by txnId
const getPaymentByTxnId = async (txnId) => {
  const result = await pool.query(
    `SELECT * FROM payments WHERE txn_id = $1`,
    [txnId]
  );
  return result.rows[0] || null;
};

// Get payments by department
const getPaymentsByDept = async (userId, department) => {
  const result = await pool.query(
    `SELECT * FROM payments WHERE user_id = $1 AND department = $2 ORDER BY created_at DESC`,
    [userId, department]
  );
  return result.rows;
};

module.exports = { createPayment, updatePaymentStatus, getPaymentsByUser, getPaymentByTxnId, getPaymentsByDept };