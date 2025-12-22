const mysql = require('mysql2/promise');
require('dotenv').config();

/**
 * MySQL Connection Pool Configuration
 * Uses connection pooling for better performance and resource management
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'company_db',
  port: process.env.DB_PORT || 3306,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
  waitForConnections: true,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

/**
 * Test database connection and log status
 */
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Company Service: MySQL database connected successfully');
    connection.release();
  } catch (error) {
    console.error('❌ Company Service: Database connection failed:', error.message);
    process.exit(1);
  }
};

// Test connection on startup
testConnection();

module.exports = pool;
