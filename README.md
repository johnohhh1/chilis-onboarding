# Chili's Onboarding Tracker

A comprehensive onboarding management system for Chili's restaurants to track new team members through their onboarding journey.

## 🚀 Features

- **Dashboard Overview**: Track all new hires with completion statistics
- **Task Management**: Comprehensive checklist for each onboarding step
- **Data Persistence**: Automatic saving with Vercel Postgres database
- **Mobile-Friendly**: Responsive design for all devices
- **Export & Print**: Generate reports and email templates

## 🛠️ Tech Stack

- **Frontend**: React 19 with Tailwind CSS
- **Backend**: Vercel Serverless Functions
- **Database**: Vercel Postgres
- **Deployment**: Vercel

## 📋 Onboarding Steps

### Step 1: Setting Up New TM
- Call candidate and extend offer
- Provide start date and First Day overview
- Download Zoom Workplace app
- Complete New Hire Application
- Create offer in Oracle
- Direct to Onboarding Journey

### Step 2: Prior to First Day
- Verify onboarding completion
- Assign job codes and pay rates

### Step 3: Prepare Materials
- VFD Par Guide
- First Day Pin
- HotSchedules Welcome Sheet
- Welcome Gift
- Training Schedule

### Step 4: First Day
- Clock-in demonstration
- I-9 verification
- Team introductions
- Brinker Nation setup
- Oracle Fusion app setup
- VFDO setup (90 minutes)

### Step 5: Post First Day
- Enable Gratshare after 72 hours
- Complete Learning Path
- Schedule job-specific webinar
- 30-Day Survey

## 🚀 Deployment

### Prerequisites
1. Vercel account
2. Vercel CLI installed

### Setup Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Deploy to Vercel**
   ```bash
   vercel
   ```

3. **Set up Vercel Postgres**
   - Go to your Vercel dashboard
   - Navigate to Storage → Create Database
   - Select Postgres
   - Copy the connection string

4. **Configure Environment Variables**
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add `POSTGRES_URL` with your database connection string

5. **Initialize Database**
   - Run the SQL commands from `database-schema.sql` in your Vercel Postgres database

6. **Deploy API Routes**
   ```bash
   vercel --prod
   ```

## 🔧 Development

### Local Development
```bash
npm start
```

The app will run on `http://localhost:3000`

### API Endpoints

- `GET /api/onboarding-data` - Retrieve all onboarding data
- `POST /api/onboarding-data` - Save onboarding data
- `GET /api/health` - Health check

## 📱 Usage

1. **Dashboard View**: Overview of all team members and their progress
2. **Add New Member**: Click "Add New Team Member" to start tracking
3. **Track Progress**: Check off completed tasks for each step
4. **Export Data**: Generate reports and email templates
5. **Auto-Save**: All changes are automatically saved to the database

## 🔒 Data Persistence

- All data is stored in Vercel Postgres database
- Automatic backups and versioning
- Fallback to localStorage if API is unavailable
- Real-time synchronization across devices

## 📞 Support

For issues or questions, please contact the development team.