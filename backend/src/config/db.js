const { Pool } = require('pg');
const logger = require('./logger');
require('dotenv').config();

// 3. Database Layer
// Connecting to PostgreSQL using the 'pg' library.
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

pool.on('connect', async () => {
  logger.info('Connected to the PostgreSQL Database successfully.');
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS SavedJobs (
          save_id           UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
          candidate_id      UUID NOT NULL REFERENCES Candidates(candidate_id) ON DELETE CASCADE,
          job_id            UUID NOT NULL REFERENCES JobPosts(job_id) ON DELETE CASCADE,
          created_at        TIMESTAMP NOT NULL DEFAULT NOW(),
          CONSTRAINT UQ_SavedJob UNIQUE (candidate_id, job_id)
      );
    `);
    
    // Auto-add face_descriptor column if it doesn't exist
    await pool.query(`
      ALTER TABLE Users ADD COLUMN IF NOT EXISTS face_descriptor TEXT;
    `);

    logger.info('Auto-migration: Checked tables and columns successfully.');
  } catch (err) {
    logger.error('Auto-migration failed:', err);
  }
});

pool.on('error', (err) => {
  logger.error('Unexpected error on idle PostgreSQL client', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
