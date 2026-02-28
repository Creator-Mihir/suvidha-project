const { Pool } = require('pg');

const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     process.env.DB_PORT     || 5432,
  database: process.env.DB_NAME     || 'auth_db',
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('connect', () => {
  console.log('[AUTH-DB] ✅ Connected to auth_db');
});

pool.on('error', (err) => {
  console.error('[AUTH-DB] ❌ Pool error:', err.message);
});

module.exports = pool;