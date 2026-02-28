const jwt = require('jsonwebtoken');

/**
 * Shared JWT authentication middleware.
 * Used by ALL microservices to verify incoming requests from the API Gateway.
 *
 * Usage in any service route:
 *   const { verifyToken, requireRole } = require('../../shared/middleware/authMiddleware');
 *   router.get('/profile', verifyToken, requireRole(['citizen']), controller);
 */

// ─── Verify JWT Token ────────────────────────────────────────────────────────
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request object for use in controllers
    req.user = {
      id:     decoded.id,
      mobile: decoded.mobile,
      role:   decoded.role,   // 'citizen' | 'dept_admin' | 'super_admin'
      dept:   decoded.dept,   // for dept_admin: 'electricity' | 'gas' | 'water' | 'municipality'
    };

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please login again.',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid token.',
    });
  }
};

// ─── Role-Based Access Control ───────────────────────────────────────────────
/**
 * @param {string[]} allowedRoles - e.g. ['dept_admin', 'super_admin']
 */
const requireRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized.',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access forbidden. Required roles: ${allowedRoles.join(', ')}`,
      });
    }

    next();
  };
};

// ─── Department-Specific Access ──────────────────────────────────────────────
/**
 * Ensures a dept_admin only accesses their own department's data.
 * @param {string} department - e.g. 'electricity'
 */
const requireDept = (department) => {
  return (req, res, next) => {
    if (req.user.role === 'super_admin') {
      return next(); // super admin can access everything
    }

    if (req.user.role === 'dept_admin' && req.user.dept === department) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: `Access forbidden. This endpoint is for ${department} department only.`,
    });
  };
};

module.exports = { verifyToken, requireRole, requireDept };