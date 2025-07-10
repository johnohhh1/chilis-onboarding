# 🌶️ Chili's Onboarding System - Production Setup Guide

## 🚀 Step 1: Set up Vercel Postgres Database

### 1.1 Create Vercel Postgres Database

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Navigate to your project dashboard

2. **Add Postgres Database**
   - Click on "Storage" tab
   - Click "Create Database"
   - Select "Postgres"
   - Choose your preferred region
   - Click "Create"

3. **Configure Environment Variables**
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add the following variables (Vercel will provide these):
     ```
     POSTGRES_URL
     POSTGRES_HOST
     POSTGRES_DATABASE
     POSTGRES_USERNAME
     POSTGRES_PASSWORD
     ```

### 1.2 Deploy and Initialize Database

1. **Deploy to Vercel**
   ```bash
   git add .
   git commit -m "Add Vercel Postgres and multi-restaurant support"
   git push origin main
   ```

2. **Database Initialization**
   - The database will be automatically initialized on first API call
   - Tables will be created: `onboarding_data`, `restaurants`
   - Default restaurant will be created automatically

## 🏢 Step 2: Multi-Restaurant Features

### 2.1 Restaurant Management

**Features Added:**
- ✅ Restaurant selector in header
- ✅ Add new restaurants via UI
- ✅ Restaurant-specific data isolation
- ✅ Multi-restaurant dashboard
- ✅ Restaurant statistics and analytics

### 2.2 API Endpoints

**New API Routes:**
- `GET /api/restaurants` - List all restaurants
- `POST /api/restaurants` - Create new restaurant
- `GET /api/restaurant-stats` - Get restaurant statistics
- `GET /api/onboarding-data?restaurant_id=X` - Get data for specific restaurant
- `POST /api/onboarding-data` - Save data with restaurant_id

### 2.3 Database Schema

**Tables Created:**
```sql
-- Restaurants table
CREATE TABLE restaurants (
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

-- Enhanced onboarding_data table
ALTER TABLE onboarding_data ADD COLUMN restaurant_id INTEGER;
ALTER TABLE onboarding_data ADD CONSTRAINT fk_restaurant 
FOREIGN KEY (restaurant_id) REFERENCES restaurants(id);
```

## 🎯 Step 3: Testing the Implementation

### 3.1 Test Database Connection

1. **Check Health Endpoint**
   ```
   GET https://your-app.vercel.app/api/health
   ```

2. **Test Restaurant Creation**
   - Go to your deployed app
   - Click restaurant selector
   - Click "Add New Restaurant"
   - Fill out the form and submit

3. **Test Data Isolation**
   - Switch between restaurants
   - Add team members in different restaurants
   - Verify data is isolated per restaurant

### 3.2 Verify Multi-Restaurant Dashboard

1. **Navigate to Multi-Restaurant Tab**
   - Click "🏢 Multi-Restaurant" tab
   - View overall statistics
   - Click on individual restaurants for details

2. **Check Restaurant Statistics**
   - Verify completion rates
   - Check member counts
   - Test restaurant switching

## 🔧 Step 4: Production Configuration

### 4.1 Environment Variables

Ensure these are set in Vercel:
```
POSTGRES_URL=postgresql://...
POSTGRES_HOST=...
POSTGRES_DATABASE=...
POSTGRES_USERNAME=...
POSTGRES_PASSWORD=...
```

### 4.2 Database Migration

The database will be automatically initialized, but you can also run the migration manually:

```sql
-- Run the multi-restaurant setup
-- This is already included in the db.js initialization
```

### 4.3 Performance Optimization

**Database Indexes Created:**
- `idx_onboarding_data_updated_at`
- `idx_onboarding_data_restaurant_id`
- `idx_onboarding_data_restaurant_updated`

## 📊 Step 5: Monitoring and Analytics

### 5.1 Multi-Restaurant Analytics

**Available Metrics:**
- Total members across all restaurants
- Completion rates per restaurant
- Active vs. pending members
- Cross-restaurant comparisons

### 5.2 Restaurant Management

**Features:**
- Add unlimited restaurants
- Restaurant-specific data isolation
- Manager contact information
- Store-specific settings

## 🚨 Troubleshooting

### Common Issues:

1. **Database Connection Failed**
   - Check environment variables in Vercel
   - Verify Postgres database is active
   - Check API logs in Vercel dashboard

2. **Restaurant Selector Not Loading**
   - Check browser console for errors
   - Verify API routes are working
   - Test `/api/restaurants` endpoint

3. **Data Not Saving**
   - Check restaurant selection
   - Verify API responses
   - Check database permissions

### Debug Steps:

1. **Check Vercel Logs**
   ```bash
   vercel logs your-app-name
   ```

2. **Test API Endpoints**
   ```bash
   curl https://your-app.vercel.app/api/health
   curl https://your-app.vercel.app/api/restaurants
   ```

3. **Database Connection Test**
   - Use Vercel dashboard to check database status
   - Verify tables are created

## 🎉 Success Criteria

✅ **Database Setup**
- Vercel Postgres connected
- Tables created successfully
- Environment variables configured

✅ **Multi-Restaurant Features**
- Restaurant selector working
- Data isolation functional
- Multi-restaurant dashboard active
- Restaurant creation working

✅ **Data Persistence**
- Data saves to database
- Restaurant-specific data loads
- Auto-save functionality working

✅ **Production Ready**
- Deployed to Vercel
- Database optimized
- Error handling implemented
- Mobile-responsive design

## 🚀 Next Steps

After successful implementation:

1. **Add More Restaurants**
   - Use the restaurant selector to add new locations
   - Configure restaurant-specific settings

2. **Customize Per Restaurant**
   - Add restaurant-specific branding
   - Customize checklist items per location
   - Set up location-specific managers

3. **Advanced Features**
   - Implement user permissions
   - Add audit trails
   - Create advanced analytics
   - Set up automated reporting

Your Chili's onboarding system is now production-ready with persistent data storage and multi-restaurant capabilities! 🌶️ 