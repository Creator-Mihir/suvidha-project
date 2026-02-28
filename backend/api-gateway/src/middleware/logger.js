/**
 * Request logger — logs every request hitting the gateway.
 * Shows method, path, status, response time, and which user made the request.
 */

const logger = (req, res, next) => {
    const start = Date.now();
  
    res.on('finish', () => {
      const duration = Date.now() - start;
      const user = req.user ? `[${req.user.role}:${req.user.id?.slice(0, 8)}]` : '[guest]';
      const status = res.statusCode;
      const color = status >= 500 ? '❌' : status >= 400 ? '⚠️' : '✅';
  
      console.log(
        `${color} ${req.method} ${req.originalUrl} ${status} ${duration}ms ${user}`
      );
    });
  
    next();
  };
  
  module.exports = logger;