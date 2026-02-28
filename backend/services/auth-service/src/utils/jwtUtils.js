const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'suvidha_dev_secret';

/**
 * Generate JWT token based on user role
 * Citizens get 30m (kiosk session), Admins get 8h (workday)
 */
const generateToken = (payload) => {
  const { role } = payload;

  const expiry = role === 'citizen'
    ? (process.env.CITIZEN_TOKEN_EXPIRY || '30m')
    : (process.env.ADMIN_TOKEN_EXPIRY   || '8h');

  return jwt.sign(payload, JWT_SECRET, { expiresIn: expiry });
};

const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = { generateToken, verifyToken };