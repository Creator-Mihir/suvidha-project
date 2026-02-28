/**
 * Global error handling middleware for all SUVIDHA microservices.
 * Add as the LAST middleware in any service's server.js:
 *   app.use(errorHandler);
 */

const errorHandler = (err, req, res, next) => {
    console.error(`[ERROR HANDLER] ${err.stack || err.message}`);
  
    // PostgreSQL specific errors
    if (err.code === '23505') {
      return res.status(409).json({
        success: false,
        message: 'Duplicate entry. Record already exists.',
      });
    }
  
    if (err.code === '23503') {
      return res.status(400).json({
        success: false,
        message: 'Referenced record does not exist.',
      });
    }
  
    // JWT errors (shouldn't reach here normally, caught in middleware)
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.',
      });
    }
  
    // Validation errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
  
    // Default 500
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || 'Internal server error.',
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    });
  };
  
  // Helper to create consistent API responses across all services
  const sendSuccess = (res, data = {}, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  };
  
  const sendError = (res, message = 'Error', statusCode = 400, data = null) => {
    return res.status(statusCode).json({
      success: false,
      message,
      ...(data && { data }),
      timestamp: new Date().toISOString(),
    });
  };
  
  module.exports = { errorHandler, sendSuccess, sendError };