const pool = require('../config/db');

// ─── User (Citizen) Queries ───────────────────────────────────────────────────

const findUserByMobile = async (mobile) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE mobile = $1 AND is_active = TRUE',
    [mobile]
  );
  return result.rows[0] || null;
};

const findUserById = async (id) => {
  const result = await pool.query(
    'SELECT id, mobile, full_name, email, role FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
};

const createUser = async ({ mobile, full_name, email, password_hash }) => {
  const result = await pool.query(
    `INSERT INTO users (mobile, full_name, email, password_hash, role)
     VALUES ($1, $2, $3, $4, 'citizen')
     RETURNING id, mobile, full_name, email, role, created_at`,
    [mobile, full_name || null, email || null, password_hash || null]
  );
  return result.rows[0];
};

// ─── OTP Queries ─────────────────────────────────────────────────────────────

const saveOTP = async (mobile, otpCode, expiresAt) => {
  // Invalidate any existing unused OTPs for this mobile
  await pool.query(
    'UPDATE otps SET is_used = TRUE WHERE mobile = $1 AND is_used = FALSE',
    [mobile]
  );

  const result = await pool.query(
    `INSERT INTO otps (mobile, otp_code, expires_at)
     VALUES ($1, $2, $3)
     RETURNING id`,
    [mobile, otpCode, expiresAt]
  );
  return result.rows[0];
};

const findValidOTP = async (mobile, otpCode) => {
  const result = await pool.query(
    `SELECT * FROM otps
     WHERE mobile = $1
       AND otp_code = $2
       AND is_used = FALSE
       AND expires_at > NOW()
       AND attempts < 3
     ORDER BY created_at DESC
     LIMIT 1`,
    [mobile, otpCode]
  );
  return result.rows[0] || null;
};

const markOTPUsed = async (otpId) => {
  await pool.query(
    'UPDATE otps SET is_used = TRUE WHERE id = $1',
    [otpId]
  );
};

const incrementOTPAttempts = async (otpId) => {
  await pool.query(
    'UPDATE otps SET attempts = attempts + 1 WHERE id = $1',
    [otpId]
  );
};

// ─── Admin Queries ────────────────────────────────────────────────────────────

const findDeptAdminByUsername = async (username) => {
  const result = await pool.query(
    'SELECT * FROM dept_admins WHERE username = $1 AND is_active = TRUE',
    [username]
  );
  return result.rows[0] || null;
};

const findSuperAdminByUsername = async (username) => {
  const result = await pool.query(
    'SELECT * FROM super_admins WHERE username = $1 AND is_active = TRUE',
    [username]
  );
  return result.rows[0] || null;
};

module.exports = {
  findUserByMobile,
  findUserById,
  createUser,
  saveOTP,
  findValidOTP,
  markOTPUsed,
  incrementOTPAttempts,
  findDeptAdminByUsername,
  findSuperAdminByUsername,
};