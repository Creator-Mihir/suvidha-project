const pool = require('../config/db');

// ─── Profile Queries ──────────────────────────────────────────────────────────

const getProfileByUserId = async (userId) => {
  const result = await pool.query(
    'SELECT * FROM citizen_profiles WHERE user_id = $1',
    [userId]
  );
  return result.rows[0] || null;
};

const createProfile = async ({ userId, fullName, address, city, state, pincode }) => {
  const result = await pool.query(
    `INSERT INTO citizen_profiles (user_id, full_name, address, city, state, pincode)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [userId, fullName, address || null, city || null, state || null, pincode || null]
  );
  return result.rows[0];
};

const updateProfile = async (userId, { fullName, address, city, state, pincode }) => {
  const result = await pool.query(
    `UPDATE citizen_profiles 
     SET full_name = COALESCE($2, full_name),
         address   = COALESCE($3, address),
         city      = COALESCE($4, city),
         state     = COALESCE($5, state),
         pincode   = COALESCE($6, pincode),
         updated_at = NOW()
     WHERE user_id = $1
     RETURNING *`,
    [userId, fullName, address, city, state, pincode]
  );
  return result.rows[0];
};

// ─── Connection Queries ───────────────────────────────────────────────────────

const getConnectionsByUserId = async (userId) => {
  const result = await pool.query(
    'SELECT * FROM citizen_connections WHERE user_id = $1 ORDER BY linked_at DESC',
    [userId]
  );
  return result.rows;
};

const addConnection = async ({ userId, department, connectionId }) => {
  const result = await pool.query(
    `INSERT INTO citizen_connections (user_id, department, connection_id)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, department, connection_id) DO NOTHING
     RETURNING *`,
    [userId, department, connectionId]
  );
  return result.rows[0];
};

const removeConnection = async (userId, department, connectionId) => {
  await pool.query(
    `DELETE FROM citizen_connections 
     WHERE user_id = $1 AND department = $2 AND connection_id = $3`,
    [userId, department, connectionId]
  );
};

module.exports = {
  getProfileByUserId,
  createProfile,
  updateProfile,
  getConnectionsByUserId,
  addConnection,
  removeConnection,
};