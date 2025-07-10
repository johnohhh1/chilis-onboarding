-- Create the onboarding_data table
CREATE TABLE IF NOT EXISTS onboarding_data (
  id SERIAL PRIMARY KEY,
  team_members JSONB NOT NULL DEFAULT '[]',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_onboarding_data_updated_at ON onboarding_data(updated_at);

-- Insert initial record if table is empty
INSERT INTO onboarding_data (team_members, updated_at) 
SELECT '[]'::jsonb, NOW()
WHERE NOT EXISTS (SELECT 1 FROM onboarding_data); 