import { sql } from '@vercel/postgres';

// Database utility functions for Vercel Postgres

export async function initializeDatabase() {
  try {
    // Create the onboarding_data table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS onboarding_data (
        id SERIAL PRIMARY KEY,
        team_members JSONB NOT NULL DEFAULT '[]',
        restaurant_id INTEGER,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // Create index for faster queries
    await sql`
      CREATE INDEX IF NOT EXISTS idx_onboarding_data_updated_at 
      ON onboarding_data(updated_at);
    `;

    // Create restaurants table if it doesn't exist
    await sql`
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
    `;

    // Add restaurant_id column to onboarding_data if it doesn't exist
    await sql`
      ALTER TABLE onboarding_data 
      ADD COLUMN IF NOT EXISTS restaurant_id INTEGER;
    `;

    // Create foreign key constraint if it doesn't exist
    await sql`
      ALTER TABLE onboarding_data 
      ADD CONSTRAINT IF NOT EXISTS fk_restaurant 
      FOREIGN KEY (restaurant_id) REFERENCES restaurants(id);
    `;

    // Create indexes for performance
    await sql`
      CREATE INDEX IF NOT EXISTS idx_onboarding_data_restaurant_id 
      ON onboarding_data(restaurant_id);
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_onboarding_data_restaurant_updated 
      ON onboarding_data(restaurant_id, updated_at);
    `;

    // Insert default restaurant if none exists
    await sql`
      INSERT INTO restaurants (name, store_number, address, manager_name, manager_email) 
      VALUES ('Chili''s - Main Location', 'C00605', 'Main Location', 'Default Manager', 'manager@chilis.com')
      ON CONFLICT (store_number) DO NOTHING;
    `;

    // Insert initial onboarding data record if table is empty
    const result = await sql`
      INSERT INTO onboarding_data (team_members, restaurant_id, updated_at) 
      SELECT '[]'::jsonb, (SELECT id FROM restaurants WHERE store_number = 'C00605' LIMIT 1), NOW()
      WHERE NOT EXISTS (SELECT 1 FROM onboarding_data);
    `;

    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
}

export async function getOnboardingData(restaurantId = null) {
  try {
    let query;
    if (restaurantId) {
      query = sql`
        SELECT * FROM onboarding_data 
        WHERE restaurant_id = ${restaurantId}
        ORDER BY updated_at DESC 
        LIMIT 1
      `;
    } else {
      query = sql`
        SELECT * FROM onboarding_data 
        ORDER BY updated_at DESC 
        LIMIT 1
      `;
    }
    
    const result = await query;
    
    if (result.rows.length > 0) {
      return {
        teamMembers: result.rows[0].team_members || [],
        lastSaved: result.rows[0].updated_at,
        version: '1.0',
        restaurantId: result.rows[0].restaurant_id
      };
    } else {
      return {
        teamMembers: [],
        lastSaved: null,
        version: '1.0',
        restaurantId: restaurantId
      };
    }
  } catch (error) {
    console.error('Error getting onboarding data:', error);
    return {
      teamMembers: [],
      lastSaved: null,
      version: '1.0',
      restaurantId: restaurantId
    };
  }
}

export async function saveOnboardingData(teamMembers, restaurantId = null) {
  try {
    const now = new Date().toISOString();
    
    if (restaurantId) {
      // Update existing record or create new one for specific restaurant
      await sql`
        INSERT INTO onboarding_data (team_members, restaurant_id, updated_at)
        VALUES (${JSON.stringify(teamMembers)}::jsonb, ${restaurantId}, ${now})
        ON CONFLICT (restaurant_id) 
        DO UPDATE SET 
          team_members = EXCLUDED.team_members,
          updated_at = EXCLUDED.updated_at
      `;
    } else {
      // For backward compatibility, update the first record
      await sql`
        UPDATE onboarding_data 
        SET team_members = ${JSON.stringify(teamMembers)}::jsonb, updated_at = ${now}
        WHERE id = (SELECT id FROM onboarding_data ORDER BY updated_at DESC LIMIT 1)
      `;
    }
    
    return {
      success: true,
      message: 'Data saved successfully',
      timestamp: now
    };
  } catch (error) {
    console.error('Error saving onboarding data:', error);
    return {
      success: false,
      error: 'Failed to save data'
    };
  }
}

export async function getAllRestaurants() {
  try {
    const result = await sql`
      SELECT * FROM restaurants 
      ORDER BY name ASC
    `;
    return result.rows;
  } catch (error) {
    console.error('Error getting restaurants:', error);
    return [];
  }
}

export async function createRestaurant(restaurantData) {
  try {
    const result = await sql`
      INSERT INTO restaurants (
        name, store_number, address, manager_name, manager_email, 
        phone, capacity, opening_hours
      ) VALUES (
        ${restaurantData.name}, 
        ${restaurantData.store_number}, 
        ${restaurantData.address || null}, 
        ${restaurantData.manager_name || null}, 
        ${restaurantData.manager_email || null},
        ${restaurantData.phone || null},
        ${restaurantData.capacity || null},
        ${restaurantData.opening_hours || null}
      ) RETURNING *
    `;
    return result.rows[0];
  } catch (error) {
    console.error('Error creating restaurant:', error);
    throw error;
  }
}

export async function getRestaurantStats(restaurantId) {
  try {
    const result = await sql`
      SELECT 
        COUNT(*) as total_members,
        COUNT(*) FILTER (WHERE team_members::text != '[]') as active_members,
        COUNT(*) FILTER (WHERE team_members::text != '[]' AND 
          (team_members->0->>'checklist')::jsonb ? 'all_completed') as completed_members,
        COUNT(*) FILTER (WHERE team_members::text != '[]' AND 
          NOT (team_members->0->>'checklist')::jsonb ? 'all_completed') as pending_members
      FROM onboarding_data 
      WHERE restaurant_id = ${restaurantId}
    `;
    return result.rows[0];
  } catch (error) {
    console.error('Error getting restaurant stats:', error);
    return {
      total_members: 0,
      active_members: 0,
      completed_members: 0,
      pending_members: 0
    };
  }
} 