const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-vercel-app.vercel.app'] // Replace with your Vercel URL
    : ['http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Data file path - use Railway's persistent storage
const DATA_FILE = process.env.NODE_ENV === 'production' 
  ? '/tmp/onboarding-data.json'  // Railway's writable directory
  : path.join(__dirname, 'data', 'onboarding-data.json');

// Ensure data directory exists (for local development)
async function ensureDataDir() {
  if (process.env.NODE_ENV !== 'production') {
    try {
      await fs.mkdir(path.join(__dirname, 'data'), { recursive: true });
    } catch (error) {
      console.log('Data directory already exists');
    }
  }
}

// Read data from file
async function readData() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return empty data structure
    return {
      teamMembers: [],
      lastSaved: null,
      version: '1.0'
    };
  }
}

// Write data to file
async function writeData(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

// Routes
app.get('/api/onboarding-data', async (req, res) => {
  try {
    const data = await readData();
    res.json(data);
  } catch (error) {
    console.error('Error reading data:', error);
    res.status(500).json({ error: 'Failed to read data' });
  }
});

app.post('/api/onboarding-data', async (req, res) => {
  try {
    const { teamMembers, lastSaved } = req.body;
    const data = {
      teamMembers,
      lastSaved,
      version: '1.0',
      updatedAt: new Date().toISOString()
    };
    
    await writeData(data);
    res.json({ success: true, message: 'Data saved successfully' });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'Failed to save data' });
  }
});

// Backup endpoint
app.post('/api/backup', async (req, res) => {
  try {
    const { teamMembers, lastSaved } = req.body;
    const backupData = {
      teamMembers,
      lastSaved,
      version: '1.0',
      backupAt: new Date().toISOString(),
      type: 'manual-backup'
    };
    
    const backupFile = process.env.NODE_ENV === 'production'
      ? `/tmp/backup-${Date.now()}.json`
      : path.join(__dirname, 'data', `backup-${Date.now()}.json`);
    
    await fs.writeFile(backupFile, JSON.stringify(backupData, null, 2));
    
    res.json({ success: true, message: 'Backup created successfully' });
  } catch (error) {
    console.error('Error creating backup:', error);
    res.status(500).json({ error: 'Failed to create backup' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: PORT
  });
});

// Initialize and start server
async function startServer() {
  await ensureDataDir();
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Onboarding API server running on port ${PORT}`);
    console.log(`📁 Data will be stored in: ${DATA_FILE}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer().catch(console.error); 