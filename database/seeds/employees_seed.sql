-- Seed Data for Employees
-- Run this AFTER inserting companies and roles seed data
-- Uses company and role IDs from seed data

USE employee_db;

-- Insert sample employee records
-- Note: company_id and role_id reference records from other services
INSERT INTO employees (id, first_name, last_name, email, company_id, role_id) VALUES
-- Tech Innovations Inc employees
('770e8400-e29b-41d4-a716-446655440001', 'John', 'Doe', 'john.doe@techinnovations.com', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001'),
('770e8400-e29b-41d4-a716-446655440002', 'Jane', 'Smith', 'jane.smith@techinnovations.com', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440002'),
('770e8400-e29b-41d4-a716-446655440003', 'Emily', 'Johnson', 'emily.johnson@techinnovations.com', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440004'),

-- Global Finance Corp employees
('770e8400-e29b-41d4-a716-446655440004', 'Michael', 'Brown', 'michael.brown@globalfinance.com', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440003'),
('770e8400-e29b-41d4-a716-446655440005', 'Sarah', 'Wilson', 'sarah.wilson@globalfinance.com', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440009'),

-- Healthcare Solutions Ltd employees
('770e8400-e29b-41d4-a716-446655440006', 'David', 'Martinez', 'david.martinez@healthcaresol.com', '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440001'),
('770e8400-e29b-41d4-a716-446655440007', 'Lisa', 'Anderson', 'lisa.anderson@healthcaresol.com', '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440006'),

-- Retail Dynamics employees
('770e8400-e29b-41d4-a716-446655440008', 'Robert', 'Taylor', 'robert.taylor@retaildynamics.com', '550e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440007'),
('770e8400-e29b-41d4-a716-446655440009', 'Jennifer', 'Thomas', 'jennifer.thomas@retaildynamics.com', '550e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440008'),

-- Manufacturing Pro employees
('770e8400-e29b-41d4-a716-446655440010', 'William', 'Moore', 'william.moore@manufacturingpro.com', '550e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440005'),
('770e8400-e29b-41d4-a716-446655440011', 'Mary', 'Jackson', 'mary.jackson@manufacturingpro.com', '550e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440010'),

-- Consulting Partners employees
('770e8400-e29b-41d4-a716-446655440012', 'James', 'White', 'james.white@consultingpartners.com', '550e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440003'),

-- Education First employees
('770e8400-e29b-41d4-a716-446655440013', 'Patricia', 'Harris', 'patricia.harris@educationfirst.com', '550e8400-e29b-41d4-a716-446655440007', '660e8400-e29b-41d4-a716-446655440006'),

-- Media & Entertainment Co employees
('770e8400-e29b-41d4-a716-446655440014', 'Christopher', 'Martin', 'chris.martin@mediaent.com', '550e8400-e29b-41d4-a716-446655440008', '660e8400-e29b-41d4-a716-446655440008'),
('770e8400-e29b-41d4-a716-446655440015', 'Barbara', 'Garcia', 'barbara.garcia@mediaent.com', '550e8400-e29b-41d4-a716-446655440008', '660e8400-e29b-41d4-a716-446655440004');

-- Verify seed data
SELECT COUNT(*) AS total_employees FROM employees;
SELECT 
  e.first_name, 
  e.last_name, 
  e.email, 
  e.company_id, 
  e.role_id 
FROM employees e 
ORDER BY e.created_at;

SELECT 'Employee seed data inserted successfully!' AS STATUS;
