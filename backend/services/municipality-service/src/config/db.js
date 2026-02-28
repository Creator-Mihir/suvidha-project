const { Pool } = require('pg');
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost', port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'municipality_db', user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '', max: 10,
});
pool.on('connect', () => console.log('[MUNI-DB] ✅ Connected to municipality_db'));
pool.on('error', (err) => console.error('[MUNI-DB] ❌', err.message));
module.exports = pool;