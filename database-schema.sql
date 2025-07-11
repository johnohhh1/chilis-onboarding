-- Chili's Onboarding Database Schema

-- Applicants table to store new hire information
CREATE TABLE IF NOT EXISTS applicants (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    position VARCHAR(100),
    restaurant_location VARCHAR(100),
    hire_date DATE,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Onboarding steps/categories
CREATE TABLE IF NOT EXISTS onboarding_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true
);

-- Individual onboarding steps
CREATE TABLE IF NOT EXISTS onboarding_steps (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES onboarding_categories(id),
    step_name VARCHAR(200) NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    is_required BOOLEAN DEFAULT true,
    estimated_time_minutes INTEGER,
    is_active BOOLEAN DEFAULT true
);

-- Applicant progress tracking
CREATE TABLE IF NOT EXISTS applicant_progress (
    id SERIAL PRIMARY KEY,
    applicant_id INTEGER REFERENCES applicants(id) ON DELETE CASCADE,
    step_id INTEGER REFERENCES onboarding_steps(id),
    status VARCHAR(50) DEFAULT 'pending', -- pending, in_progress, completed, skipped
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    notes TEXT,
    completed_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Team members who can manage onboarding
CREATE TABLE IF NOT EXISTS team_members (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'manager', -- admin, manager, trainer
    restaurant_location VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default onboarding categories in logical order
INSERT INTO onboarding_categories (name, description, order_index) VALUES
('Pre-Employment', 'Documents and requirements before starting', 1),
('First Day', 'Orientation and initial setup', 2),
('Training & Certification', 'Required training and certifications', 3),
('Safety & Compliance', 'Safety training and compliance requirements', 4),
('Systems & Technology', 'Computer systems and technology training', 5),
('Team Integration', 'Meeting team and understanding culture', 6),
('Final Review', 'Final assessments and completion', 7)
ON CONFLICT DO NOTHING;

-- Insert default onboarding steps in logical order
INSERT INTO onboarding_steps (category_id, step_name, description, order_index, is_required, estimated_time_minutes) VALUES
-- Pre-Employment (Category 1)
(1, 'Background Check', 'Complete background check process', 1, true, 30),
(1, 'Drug Test', 'Complete required drug screening', 2, true, 60),
(1, 'I-9 Form', 'Complete employment eligibility verification', 3, true, 15),
(1, 'W-4 Form', 'Complete tax withholding form', 4, true, 10),
(1, 'Direct Deposit Setup', 'Set up direct deposit for payroll', 5, true, 10),
(1, 'Employee Handbook Review', 'Review and acknowledge employee handbook', 6, true, 45),

-- First Day (Category 2)
(2, 'Welcome Orientation', 'Welcome meeting with manager', 1, true, 30),
(2, 'Tour of Restaurant', 'Complete restaurant tour and safety overview', 2, true, 45),
(2, 'Uniform & Equipment', 'Receive uniform and necessary equipment', 3, true, 15),
(2, 'Time Clock Setup', 'Set up time clock access and training', 4, true, 10),
(2, 'Emergency Procedures', 'Review emergency procedures and exits', 5, true, 20),

-- Training & Certification (Category 3)
(3, 'Food Safety Certification', 'Complete food safety training and certification', 1, true, 120),
(3, 'Alcohol Service Training', 'Complete alcohol service training (if applicable)', 2, false, 60),
(3, 'POS System Training', 'Learn point of sale system', 3, true, 90),
(3, 'Customer Service Training', 'Complete customer service training', 4, true, 60),
(3, 'Menu Knowledge', 'Learn menu items and preparation', 5, true, 120),

-- Safety & Compliance (Category 4)
(4, 'Workplace Safety Training', 'Complete workplace safety training', 1, true, 60),
(4, 'Hazard Communication', 'Review hazard communication procedures', 2, true, 30),
(4, 'First Aid Training', 'Complete first aid and CPR training', 3, true, 120),
(4, 'Fire Safety Training', 'Complete fire safety training', 4, true, 30),

-- Systems & Technology (Category 5)
(5, 'Computer System Access', 'Set up computer system access', 1, true, 20),
(5, 'Email Setup', 'Set up company email account', 2, true, 15),
(5, 'Mobile App Training', 'Learn mobile ordering and payment systems', 3, true, 45),
(5, 'Inventory System', 'Learn inventory management system', 4, true, 60),

-- Team Integration (Category 6)
(6, 'Team Introduction', 'Meet team members and managers', 1, true, 30),
(6, 'Culture & Values', 'Learn company culture and values', 2, true, 45),
(6, 'Communication Training', 'Learn communication protocols', 3, true, 30),
(6, 'Shadow Training', 'Shadow experienced team member', 4, true, 240),

-- Final Review (Category 7)
(7, 'Skills Assessment', 'Complete skills assessment', 1, true, 60),
(7, 'Final Review Meeting', 'Meeting with manager for final review', 2, true, 30),
(7, 'Onboarding Survey', 'Complete onboarding feedback survey', 3, true, 15),
(7, 'Certification Complete', 'All certifications and training complete', 4, true, 0)
ON CONFLICT DO NOTHING;

-- Insert default team members
INSERT INTO team_members (username, password_hash, first_name, last_name, role, restaurant_location) VALUES
('ChilisAdmin', '$2b$10$rQZ8K9mN2pL1sT3uV5wX7yA0bC1dE2fG3hI4jK5lM6nO7pQ8rS9tU0vW1x2Y3z', 'Admin', 'User', 'admin', 'All Locations'),
('Chilis605', '$2b$10$rQZ8K9mN2pL1sT3uV5wX7yA0bC1dE2fG3hI4jK5lM6nO7pQ8rS9tU0vW1x2Y3z', 'Manager', 'User', 'manager', 'Location 605')
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_applicant_progress_applicant_id ON applicant_progress(applicant_id);
CREATE INDEX IF NOT EXISTS idx_applicant_progress_step_id ON applicant_progress(step_id);
CREATE INDEX IF NOT EXISTS idx_applicant_progress_status ON applicant_progress(status);
CREATE INDEX IF NOT EXISTS idx_onboarding_steps_category_id ON onboarding_steps(category_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_steps_order ON onboarding_steps(order_index); 