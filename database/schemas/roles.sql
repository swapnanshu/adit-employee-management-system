-- Role Database Schema
-- MySQL 8.0+

-- Create database (if needed)
CREATE DATABASE IF NOT EXISTS role_db;
USE role_db;

-- Drop table if exists (for clean setup)
DROP TABLE IF EXISTS roles;

-- Create roles table
CREATE TABLE roles (
  id CHAR(36) PRIMARY KEY COMMENT 'UUID primary key',
  title VARCHAR(50) NOT NULL UNIQUE COMMENT 'Role title (unique)',
  description VARCHAR(200) NOT NULL COMMENT 'Role description',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation timestamp',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update timestamp',
  
  INDEX idx_title (title) COMMENT 'Index for role title lookups'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Job roles table';

-- Verify table creation
DESCRIBE roles;

SELECT 'Roles table created successfully!' AS STATUS;
