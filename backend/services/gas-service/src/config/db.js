const { Pool } = require('pg');
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost', port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'gas_db', user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '', max: 10,
});
pool.on('connect', () => console.log('[GAS-DB] ✅ Connected to gas_db'));
pool.on('error', (err) => console.error('[GAS-DB] ❌', err.message));
module.exports = pool;