const { Pool } = require('pg');

/**
 * Creates a PostgreSQL connection pool for a given service.
 * Each microservice calls this with its own DB config from .env
 *
 * Usage in any service:
 *   const createPool = require('../../shared/database');
 *   const pool = createPool();
 */

const createPool = (config = {}) => {
  const pool = new Pool({
    host:     config.host     || process.env.DB_HOST     || 'localhost',
    port:     config.port     || process.env.DB_PORT     || 5432,
    database: config.database || process.env.DB_NAME,
    user:     config.user     || process.env.DB_USER     || 'postgres',
    password: config.password || process.env.DB_PASSWORD,
    max:               10,   // max connections in pool
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  // Test connection on startup
  pool.connect((err, client, release) => {
    if (err) {
      console.error(`[DB] ❌ Failed to connect to database "${process.env.DB_NAME}":`, err.message);
    } else {
      console.log(`[DB] ✅ Connected to PostgreSQL database "${process.env.DB_NAME}"`);
      release();
    }
  });

  // Handle unexpected pool errors
  pool.on('error', (err) => {
    console.error('[DB] Unexpected pool error:', err.message);
  });

  return pool;
};

module.exports = createPool;