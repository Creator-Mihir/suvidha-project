const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Verify JWT token — runs on all protected routes.
 * If valid, forwards user info to the downstream service via headers.
 */
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
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach decoded user to request
    req.user = decoded;

    // Forward user info to downstream services via headers
    // So each service knows WHO is making the request
    req.headers['x-user-id']   = decoded.id;
    req.headers['x-user-role'] = decoded.role;
    req.headers['x-user-dept'] = decoded.dept || '';

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Session expired. Please login again.',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid token.',
    });
  }
};

/**
 * Role-based access control
 * Usage: requireRole(['dept_admin', 'super_admin'])
 */
const requireRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access forbidden. Required role: ${allowedRoles.join(' or ')}`,
      });
    }

    next();
  };
};

module.exports = { verifyToken, requireRole };