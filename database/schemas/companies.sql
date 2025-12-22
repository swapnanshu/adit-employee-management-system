-- Company Database Schema
-- MySQL 8.0+

-- Create database (if needed)
CREATE DATABASE IF NOT EXISTS company_db;
USE company_db;

-- Drop table if exists (for clean setup)
DROP TABLE IF EXISTS companies;

-- Create companies table
CREATE TABLE companies (
  id CHAR(36) PRIMARY KEY COMMENT 'UUID primary key',
  name VARCHAR(100) NOT NULL UNIQUE COMMENT 'Company name (unique)',
  industry VARCHAR(50) NOT NULL COMMENT 'Industry sector',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation timestamp',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update timestamp',
  
  INDEX idx_name (name) COMMENT 'Index for company name lookups'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Company records table';

-- Verify table creation
DESCRIBE companies;

SELECT 'Company table created successfully!' AS STATUS;
