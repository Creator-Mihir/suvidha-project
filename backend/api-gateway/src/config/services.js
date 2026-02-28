/**
 * All microservice URLs in one place.
 * Gateway uses these to forward requests to the right service.
 */

const SERVICES = {
    auth:         process.env.AUTH_SERVICE_URL         || 'http://localhost:3001',
    citizen:      process.env.CITIZEN_SERVICE_URL      || 'http://localhost:3002',
    electricity:  process.env.ELECTRICITY_SERVICE_URL  || 'http://localhost:3003',
    gas:          process.env.GAS_SERVICE_URL          || 'http://localhost:3004',
    water:        process.env.WATER_SERVICE_URL        || 'http://localhost:3005',
    municipality: process.env.MUNICIPALITY_SERVICE_URL || 'http://localhost:3006',
    payment:      process.env.PAYMENT_SERVICE_URL      || 'http://localhost:3007',
    grievance:    process.env.GRIEVANCE_SERVICE_URL    || 'http://localhost:3008',
    notification: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3009',
    report:       process.env.REPORT_SERVICE_URL       || 'http://localhost:3010',
    gemini:       process.env.GEMINI_SERVICE_URL       || 'http://localhost:5008',

  };
  
  module.exports = SERVICES;