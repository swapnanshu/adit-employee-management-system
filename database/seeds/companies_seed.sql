-- Seed Data for Companies
-- Run this after creating the companies table

USE company_db;

-- Insert sample company records
INSERT INTO companies (id, name, industry) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Tech Innovations Inc', 'Technology'),
('550e8400-e29b-41d4-a716-446655440002', 'Global Finance Corp', 'Finance'),
('550e8400-e29b-41d4-a716-446655440003', 'Healthcare Solutions Ltd', 'Healthcare'),
('550e8400-e29b-41d4-a716-446655440004', 'Retail Dynamics', 'Retail'),
('550e8400-e29b-41d4-a716-446655440005', 'Manufacturing Pro', 'Manufacturing'),
('550e8400-e29b-41d4-a716-446655440006', 'Consulting Partners', 'Consulting'),
('550e8400-e29b-41d4-a716-446655440007', 'Education First', 'Education'),
('550e8400-e29b-41d4-a716-446655440008', 'Media & Entertainment Co', 'Media');

-- Verify seed data
SELECT COUNT(*) AS total_companies FROM companies;
SELECT * FROM companies ORDER BY created_at;

SELECT 'Company seed data inserted successfully!' AS STATUS;
