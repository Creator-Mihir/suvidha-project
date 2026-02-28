const citizenModel = require('../models/citizenModel');

// ─── Get Profile ──────────────────────────────────────────────────────────────

/**
 * GET /citizen/profile
 * Returns citizen profile — used by dashboard to show name
 */
const getProfile = async (req, res) => {
  try {
    // user_id comes from JWT via API Gateway header
    const userId = req.headers['x-user-id'];

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized.' });
    }

    const profile = await citizenModel.getProfileByUserId(userId);

    return res.status(200).json({
      success: true,
      data: {
        profile,
        hasProfile: !!profile,  // frontend uses this to decide redirect
      },
    });
  } catch (err) {
    console.error('[CITIZEN] getProfile error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch profile.' });
  }
};

// ─── Create / Setup Profile (First Time) ─────────────────────────────────────

/**
 * POST /citizen/profile/setup
 * Called after first OTP login — saves citizen name
 * Body: { fullName, city, state, pincode }
 */
const setupProfile = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const { fullName, address, city, state, pincode } = req.body;

    if (!fullName || fullName.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Please enter your full name.',
      });
    }

    // Check if profile already exists
    const existing = await citizenModel.getProfileByUserId(userId);

    let profile;
    if (existing) {
      // Update existing
      profile = await citizenModel.updateProfile(userId, {
        fullName: fullName.trim(),
        address, city, state, pincode,
      });
    } else {
      // Create new
      profile = await citizenModel.createProfile({
        userId,
        fullName: fullName.trim(),
        address, city, state, pincode,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile saved successfully.',
      data: { profile },
    });
  } catch (err) {
    console.error('[CITIZEN] setupProfile error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to save profile.' });
  }
};

// ─── Update Profile ───────────────────────────────────────────────────────────

const updateProfile = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const { fullName, address, city, state, pincode } = req.body;

    const profile = await citizenModel.updateProfile(userId, {
      fullName, address, city, state, pincode,
    });

    return res.status(200).json({
      success: true,
      message: 'Profile updated.',
      data: { profile },
    });
  } catch (err) {
    console.error('[CITIZEN] updateProfile error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
};

// ─── Department Connections ───────────────────────────────────────────────────

/**
 * GET /citizen/connections
 * Returns all department IDs linked to this citizen
 */
const getConnections = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const connections = await citizenModel.getConnectionsByUserId(userId);

    return res.status(200).json({
      success: true,
      data: { connections },
    });
  } catch (err) {
    console.error('[CITIZEN] getConnections error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch connections.' });
  }
};

/**
 * POST /citizen/connections
 * Links a department connection ID to citizen
 * Body: { department, connectionId }
 */
const addConnection = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const { department, connectionId } = req.body;

    if (!department || !connectionId) {
      return res.status(400).json({
        success: false,
        message: 'Department and connection ID are required.',
      });
    }

    const connection = await citizenModel.addConnection({
      userId, department, connectionId,
    });

    return res.status(200).json({
      success: true,
      message: `${department} connection linked successfully.`,
      data: { connection },
    });
  } catch (err) {
    console.error('[CITIZEN] addConnection error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to add connection.' });
  }
};

module.exports = {
  getProfile,
  setupProfile,
  updateProfile,
  getConnections,
  addConnection,
};