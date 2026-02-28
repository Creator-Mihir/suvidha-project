/**
 * Simple shared logger for all SUVIDHA microservices.
 * Each service passes its name so logs are identifiable.
 *
 * Usage:
 *   const createLogger = require('../../shared/logger');
 *   const logger = createLogger('auth-service');
 *   logger.info('Server started');
 *   logger.error('Something failed', err);
 */

const createLogger = (serviceName = 'service') => {
    const timestamp = () => new Date().toISOString();
  
    return {
      info: (message, data = '') => {
        console.log(`[${timestamp()}] [${serviceName.toUpperCase()}] ℹ️  INFO: ${message}`, data);
      },
      success: (message, data = '') => {
        console.log(`[${timestamp()}] [${serviceName.toUpperCase()}] ✅ SUCCESS: ${message}`, data);
      },
      warn: (message, data = '') => {
        console.warn(`[${timestamp()}] [${serviceName.toUpperCase()}] ⚠️  WARN: ${message}`, data);
      },
      error: (message, err = '') => {
        console.error(`[${timestamp()}] [${serviceName.toUpperCase()}] ❌ ERROR: ${message}`, err?.message || err);
      },
      debug: (message, data = '') => {
        if (process.env.NODE_ENV !== 'production') {
          console.log(`[${timestamp()}] [${serviceName.toUpperCase()}] 🐛 DEBUG: ${message}`, data);
        }
      },
    };
  };
  
  module.exports = createLogger;