const bcrypt = require('bcrypt');
const authModel = require('../models/authModel');
const { generateToken } = require('../utils/jwtUtils');
const { generateOTPCode, getOTPExpiry, sendOTP } = require('../utils/otpUtils');

// ─── OTP Flow (Citizens on Kiosk) ────────────────────────────────────────────

/**
 * POST /auth/otp/request
 * Body: { mobile }
 * Creates or finds citizen, generates OTP, sends via SMS
 */
const requestOTP = async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile || !/^[6-9]\d{9}$/.test(mobile)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 10-digit Indian mobile number.',
      });
    }

    // Auto-register citizen if first time
    let user = await authModel.findUserByMobile(mobile);
    if (!user) {
      user = await authModel.createUser({ mobile });
    }

    // For mock mode, use fixed OTP for easy testing
    // NEW
        const otpCode = process.env.MOCK_OTP_CODE 
        ? process.env.MOCK_OTP_CODE 
         : generateOTPCode();
    const expiresAt = getOTPExpiry();

    await authModel.saveOTP(mobile, otpCode, expiresAt);
    await sendOTP(mobile, otpCode);

    return res.status(200).json({
      success: true,
      message: `OTP sent to ${mobile}`,
      // Only expose in dev for easy testing
      ...(process.env.NODE_ENV === 'development' && { debug_otp: otpCode }),
    });

  } catch (err) {
    console.error('[AUTH] requestOTP error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to send OTP.' });
  }
};

/**
 * POST /auth/otp/verify
 * Body: { mobile, otp }
 * Verifies OTP and returns JWT token
 */
const verifyOTP = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Mobile and OTP are required.',
      });
    }

    const otpRecord = await authModel.findValidOTP(mobile, otp);

    if (!otpRecord) {
      // Try to increment attempts on the latest OTP
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP. Please request a new one.',
      });
    }

    // Mark OTP as used
    await authModel.markOTPUsed(otpRecord.id);

    const user = await authModel.findUserByMobile(mobile);

    const token = generateToken({
      id:     user.id,
      mobile: user.mobile,
      role:   'citizen',
    });

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        token,
        user: {
          id:        user.id,
          mobile:    user.mobile,
          full_name: user.full_name,
          role:      'citizen',
        },
        expires_in: process.env.CITIZEN_TOKEN_EXPIRY || '30m',
      },
    });

  } catch (err) {
    console.error('[AUTH] verifyOTP error:', err.message);
    return res.status(500).json({ success: false, message: 'OTP verification failed.' });
  }
};

// ─── Password Flow (Department Admins & Super Admins) ────────────────────────

/**
 * POST /auth/login
 * Body: { username, password, role } 
 * role: 'dept_admin' | 'super_admin'
 */
const loginWithPassword = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Username, password, and role are required.',
      });
    }

    if (!['dept_admin', 'super_admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be dept_admin or super_admin.',
      });
    }

    let admin = null;

    if (role === 'dept_admin') {
      admin = await authModel.findDeptAdminByUsername(username);
    } else {
      admin = await authModel.findSuperAdminByUsername(username);
    }

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.',
      });
    }

    const tokenPayload = {
      id:   admin.id,
      role: role,
      ...(role === 'dept_admin' && { dept: admin.department }),
    };

    const token = generateToken(tokenPayload);

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        token,
        user: {
          id:         admin.id,
          username:   admin.username,
          full_name:  admin.full_name,
          role:       role,
          ...(role === 'dept_admin' && {
            department: admin.department,
            district:   admin.district,
          }),
          ...(role === 'super_admin' && {
            level:  admin.level,
            region: admin.region,
          }),
        },
        expires_in: process.env.ADMIN_TOKEN_EXPIRY || '8h',
      },
    });

  } catch (err) {
    console.error('[AUTH] loginWithPassword error:', err.message);
    return res.status(500).json({ success: false, message: 'Login failed.' });
  }
};

// ─── Token Verify (used by API Gateway) ──────────────────────────────────────

/**
 * GET /auth/verify
 * Header: Authorization: Bearer <token>
 * Used by API Gateway to validate tokens from other services
 */
const verifyTokenEndpoint = async (req, res) => {
  try {
    // verifyToken middleware already ran — req.user is populated
    const user = await authModel.findUserById(req.user.id);

    return res.status(200).json({
      success: true,
      message: 'Token is valid.',
      data: req.user,
    });
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token verification failed.' });
  }
};

/**
 * POST /auth/logout
 * For kiosk sessions — client deletes token, server logs it
 */
const logout = async (req, res) => {
  // JWT is stateless — real logout happens client-side by deleting the token
  // For enhanced security, you'd maintain a token blacklist in Redis
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully. Please clear your session.',
  });
};

module.exports = {
  requestOTP,
  verifyOTP,
  loginWithPassword,
  verifyTokenEndpoint,
  logout,
};