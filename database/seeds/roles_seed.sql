-- Seed Data for Roles
-- Run this after creating the roles table

USE role_db;

-- Insert sample role records
INSERT INTO roles (id, title, description) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Software Developer', 'Develops and maintains software applications and systems'),
('660e8400-e29b-41d4-a716-446655440002', 'Senior Developer', 'Lead developer with advanced technical skills and mentorship responsibilities'),
('660e8400-e29b-41d4-a716-446655440003', 'Product Manager', 'Manages product strategy, roadmap, and stakeholder communication'),
('660e8400-e29b-41d4-a716-446655440004', 'UX Designer', 'Designs user experiences and interfaces for digital products'),
('660e8400-e29b-41d4-a716-446655440005', 'DevOps Engineer', 'Manages infrastructure, CI/CD pipelines, and deployment automation'),
('660e8400-e29b-41d4-a716-446655440006', 'HR Manager', 'Manages human resources, recruiting, and employee relations'),
('660e8400-e29b-41d4-a716-446655440007', 'Sales Executive', 'Drives sales, manages client relationships, and achieves revenue targets'),
('660e8400-e29b-41d4-a716-446655440008', 'Marketing Specialist', 'Creates and executes marketing campaigns and brand strategies'),
('660e8400-e29b-41d4-a716-446655440009', 'Data Analyst', 'Analyzes data to provide insights and support decision-making'),
('660e8400-e29b-41d4-a716-446655440010', 'QA Engineer', 'Ensures software quality through testing and quality assurance processes');

-- Verify seed data
SELECT COUNT(*) AS total_roles FROM roles;
SELECT * FROM roles ORDER BY created_at;

SELECT 'Role seed data inserted successfully!' AS STATUS;
