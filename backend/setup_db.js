require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// ─── Step 1: Connect to postgres (default DB) to create nexthire_db ─────────
async function setup() {
  console.log('\n🚀 NextHire Database Setup Starting...\n');

  // Connect to the default "postgres" database first to create our DB
  const adminPool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || '1234',
    database: 'postgres', // connect to default db
    port: process.env.DB_PORT || 5432,
  });

  try {
    // ─── Create Database if not exists ────────────────────────────────
    const dbName = process.env.DB_NAME || 'nexthire_db';
    
    // Check if database exists
    const checkDB = await adminPool.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]
    );

    if (checkDB.rows.length === 0) {
      // Create DB (cannot be done in transaction)
      await adminPool.query(`CREATE DATABASE ${dbName}`);
      console.log(`✅ Database "${dbName}" created successfully.`);
    } else {
      console.log(`ℹ️  Database "${dbName}" already exists.`);
    }
  } catch (err) {
    console.error('❌ Database creation failed:', err.message);
  } finally {
    await adminPool.end();
  }

  // ─── Step 2: Connect to nexthire_db and run the schema ────────────────────
  const appPool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || '1234',
    database: process.env.DB_NAME || 'nexthire_db',
    port: process.env.DB_PORT || 5432,
  });

  try {
    // Read and run the PostgreSQL init script
    const sqlFilePath = path.join(__dirname, '..', 'init_db_postgres.sql');
    
    if (!fs.existsSync(sqlFilePath)) {
      console.error(`❌ init_db_postgres.sql not found at ${sqlFilePath}`);
      process.exit(1);
    }

    const sql = fs.readFileSync(sqlFilePath, 'utf-8');
    await appPool.query(sql);
    console.log('✅ All 18 tables created successfully!');
    console.log('✅ Indexes created.');
    console.log('\n🎉 NextHire database is ready!\n');
    console.log('📝 Connection details:');
    console.log(`   Host:     ${process.env.DB_HOST || 'localhost'}`);
    console.log(`   Port:     ${process.env.DB_PORT || 5432}`);
    console.log(`   Database: ${process.env.DB_NAME || 'nexthire_db'}`);
    console.log(`   User:     ${process.env.DB_USER || 'postgres'}`);
    console.log('\n▶️  Now you can run the backend safely.\n');
  } catch (err) {
    console.error('❌ Schema initialization failed:', err.message);
  } finally {
    await appPool.end();
  }
}

setup();
