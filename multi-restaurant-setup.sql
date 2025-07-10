-- Multi-Restaurant Database Setup Script
-- Run this after your initial deployment to add multi-restaurant support

BEGIN;

-- Create restaurants table
CREATE TABLE IF NOT EXISTS restaurants (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  store_number VARCHAR(10) UNIQUE NOT NULL,
  address TEXT,
  manager_name VARCHAR(255),
  manager_email VARCHAR(255),
  phone VARCHAR(20),
  capacity INTEGER,
  opening_hours VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add restaurant_id column to onboarding_data table
ALTER TABLE onboarding_data 
ADD COLUMN IF NOT EXISTS restaurant_id INTEGER;

-- Create foreign key constraint
ALTER TABLE onboarding_data 
ADD CONSTRAINT IF NOT EXISTS fk_restaurant 
FOREIGN KEY (restaurant_id) REFERENCES restaurants(id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_onboarding_data_restaurant_id 
ON onboarding_data(restaurant_id);

CREATE INDEX IF NOT EXISTS idx_onboarding_data_restaurant_updated 
ON onboarding_data(restaurant_id, updated_at);

-- Insert default restaurant (for existing data)
INSERT INTO restaurants (name, store_number, address, manager_name, manager_email) 
VALUES ('Chili''s - Main Location', 'C00605', 'Main Location', 'Default Manager', 'manager@chilis.com')
ON CONFLICT (store_number) DO NOTHING;

-- Update existing onboarding data to use default restaurant
UPDATE onboarding_data 
SET restaurant_id = (SELECT id FROM restaurants WHERE store_number = 'C00605' LIMIT 1)
WHERE restaurant_id IS NULL;

-- Create restaurant management functions
CREATE OR REPLACE FUNCTION get_restaurant_stats(restaurant_id INTEGER)
RETURNS TABLE(
  total_members INTEGER,
  active_members INTEGER,
  completed_members INTEGER,
  pending_members INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER as total_members,
    COUNT(*) FILTER (WHERE team_members::text != '[]')::INTEGER as active_members,
    COUNT(*) FILTER (WHERE team_members::text != '[]' AND 
      (team_members->0->>'checklist')::jsonb ? 'all_completed')::INTEGER as completed_members,
    COUNT(*) FILTER (WHERE team_members::text != '[]' AND 
      NOT (team_members->0->>'checklist')::jsonb ? 'all_completed')::INTEGER as pending_members
  FROM onboarding_data 
  WHERE restaurant_id = get_restaurant_stats.restaurant_id;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_restaurants_updated_at 
    BEFORE UPDATE ON restaurants 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

COMMIT;

-- Verify setup
SELECT 'Database setup completed successfully!' as status;
SELECT COUNT(*) as restaurant_count FROM restaurants;
SELECT COUNT(*) as onboarding_records FROM onboarding_data; 