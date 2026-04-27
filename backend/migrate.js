require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

async function migrate() {
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
    console.log("Migration successful!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await pool.end();
  }
}

migrate();
