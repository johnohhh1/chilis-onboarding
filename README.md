# 🌶️ Chili's Onboarding Tracker

A comprehensive onboarding management system for tracking new hires and ensuring they don't get lost in bureaucracy.

## ✨ Features

- **Multi-User Support**: Shared data across all managers and HR staff
- **Real-time Dashboard**: Overview of all new hires with status tracking
- **Task Management**: Check off onboarding tasks with progress tracking
- **Data Persistence**: Server-side storage with automatic backups
- **Mobile-Friendly**: Responsive design that works on all devices
- **Auto-Save**: Changes are automatically saved to prevent data loss

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd chilis-onboarding
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

This will start both the backend API server (port 3001) and the React frontend (port 3000).

## 📁 Project Structure

```
chilis-onboarding/
├── src/                    # React frontend
│   ├── App.js             # Main application component
│   └── index.js           # React entry point
├── server.js              # Express backend API
├── data/                  # Data storage (auto-created)
│   └── onboarding-data.json
└── package.json
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:3001/api

# Server Configuration
PORT=3001
```

## 📊 API Endpoints

- `GET /api/onboarding-data` - Retrieve all onboarding data
- `POST /api/onboarding-data` - Save onboarding data
- `POST /api/backup` - Create a manual backup
- `GET /api/health` - Health check endpoint

## 🗄️ Data Storage

All data is stored in JSON files in the `data/` directory:
- `onboarding-data.json` - Main data file
- `backup-*.json` - Manual backup files

## 🚀 Deployment Options

### Option 1: Simple Hosting (Recommended)
- **Frontend**: Deploy to Vercel, Netlify, or GitHub Pages
- **Backend**: Deploy to Railway, Render, or Heroku
- **Database**: Use the built-in file storage or upgrade to a proper database

### Option 2: Full-Stack Platform
- Deploy to platforms like Railway, Render, or Heroku that support both frontend and backend

### Option 3: Self-Hosted
- Deploy to your own server or VPS
- Use a reverse proxy (nginx) to serve both frontend and backend

## 🔒 Security Considerations

- The current implementation uses file-based storage
- For production, consider:
  - Adding authentication/authorization
  - Using a proper database (PostgreSQL, MongoDB)
  - Implementing rate limiting
  - Adding HTTPS
  - Setting up proper CORS policies

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start both frontend and backend
- `npm run server` - Start only the backend server
- `npm start` - Start only the React frontend
- `npm run build` - Build for production

### Adding New Features

1. **Backend**: Add new routes in `server.js`
2. **Frontend**: Update components in `src/App.js`
3. **Data**: The data structure is flexible and can be extended

## 📈 Future Enhancements

- [ ] User authentication and roles
- [ ] Email notifications for overdue tasks
- [ ] Integration with HR systems
- [ ] Advanced reporting and analytics
- [ ] Mobile app version
- [ ] Real-time collaboration features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.