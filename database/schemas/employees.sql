-- Employee Database Schema
-- MySQL 8.0+

-- Create database (if needed)
CREATE DATABASE IF NOT EXISTS employee_db;
USE employee_db;

-- Drop table if exists (for clean setup)
DROP TABLE IF EXISTS employees;

-- Create employees table
CREATE TABLE employees (
  id CHAR(36) PRIMARY KEY COMMENT 'UUID primary key',
  first_name VARCHAR(50) NOT NULL COMMENT 'Employee first name',
  last_name VARCHAR(50) NOT NULL COMMENT 'Employee last name',
  email VARCHAR(100) NOT NULL UNIQUE COMMENT 'Unique email address',
  company_id CHAR(36) NOT NULL COMMENT 'Foreign key to Company Service',
  role_id CHAR(36) NOT NULL COMMENT 'Foreign key to Role Service',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation timestamp',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update timestamp',
  
  INDEX idx_company_id (company_id) COMMENT 'Index for company lookups',
  INDEX idx_role_id (role_id) COMMENT 'Index for role lookups',
  INDEX idx_email (email) COMMENT 'Index for email lookups'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Employee records table';

-- Note: Foreign key constraints are NOT enforced at the database level
-- because company_id and role_id reference records in other microservices' databases.
-- Referential integrity is enforced at the application layer via inter-service communication.

-- Verify table creation
DESCRIBE employees;

SELECT 'Employees table created successfully!' AS STATUS;
