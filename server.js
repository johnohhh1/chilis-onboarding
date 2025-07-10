const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Data file path
const dataFile = path.join(__dirname, 'data', 'onboarding-data.json');

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Initialize data file if it doesn't exist
if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, JSON.stringify({
    teamMembers: [],
    lastSaved: null,
    version: '1.0'
  }));
}

// Helper function to read data
const readData = () => {
  try {
    const data = fs.readFileSync(dataFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data:', error);
    return { teamMembers: [], lastSaved: null, version: '1.0' };
  }
};

// Helper function to write data
const writeData = (data) => {
  try {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing data:', error);
    return false;
  }
};

// API Routes
app.get('/api/onboarding-data', (req, res) => {
  try {
    const data = readData();
    res.json(data);
  } catch (error) {
    console.error('Error getting data:', error);
    res.status(500).json({ error: 'Failed to get data' });
  }
});

app.post('/api/onboarding-data', (req, res) => {
  try {
    const { teamMembers, lastSaved } = req.body;
    const data = {
      teamMembers: teamMembers || [],
      lastSaved: lastSaved || new Date().toISOString(),
      version: '1.0'
    };
    
    if (writeData(data)) {
      res.json({ 
        success: true, 
        message: 'Data saved successfully',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({ error: 'Failed to save data' });
    }
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'Failed to save data' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Development API server running on port ${PORT}`);
  console.log(`📁 Data will be stored in: ${dataFile}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
}); 