# 605 Team Member Onboarding Tracker 🚀

> **A comprehensive digital solution for managing restaurant team member onboarding with real-time progress tracking, automated reporting, and seamless email integration.**

![App Preview](https://img.shields.io/badge/Status-Production%20Ready-brightgreen) ![React](https://img.shields.io/badge/React-18.0+-blue) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0+-06B6D4)

## ✨ Features

### 📋 **Smart Checklist Management**
- **40+ Step Comprehensive Checklist** based on official Chili's onboarding procedures
- **5-Phase Organization**: Setup → Pre-First Day → Materials → First Day → Post-First Day
- **Color-coded Steps** for easy visual identification
- **Real-time Progress Tracking** with completion percentages

### 👥 **Team Member Management**
- **Required Field Validation** (Name, Start Date & Time, Phone, Position)
- **Inline Editing** of team member information
- **Smart Data Persistence** with localStorage
- **Last Modified Tracking** for accountability

### 📊 **Progress Analytics**
- **Live Dashboard** showing total, completed, in-progress, and not-started members
- **Visual Progress Bars** for each team member
- **Completion Statistics** at a glance
- **Task Remaining Counter** for quick status checks

### 📧 **Email Integration**
- **One-Click Email Reports** that open your device's email app
- **Pre-formatted Report Content** with all essential information
- **Restaurant Email Support** for easy communication
- **Professional Report Templates**

### 🖨️ **Print-Ready Reports**
- **Daily Action Reports** showing remaining tasks
- **Supply Checklists** for preparation
- **Professional Formatting** for management review
- **Complete Team Member Profiles**

### 💾 **Data Management**
- **Auto-Save Functionality** with unsaved changes indicators
- **Export All Data** as JSON for backups
- **Offline Capability** - works without internet
- **Data Recovery** from browser storage

## 🏗️ **Tech Stack**

| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | Frontend Framework | 18.0+ |
| **TailwindCSS** | Styling & Design | 3.0+ |
| **Lucide React** | Icons & UI Elements | Latest |
| **localStorage** | Data Persistence | Browser Native |
| **PostCSS** | CSS Processing | Latest |

## 🚀 **Quick Start**

### Prerequisites
- Node.js 14+ installed
- npm or yarn package manager
- Modern web browser

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/605-onboarding-tracker.git

# Navigate to project directory
cd 605-onboarding-tracker

# Install dependencies
npm install

# Install required packages
npm install lucide-react
npm install -D tailwindcss postcss autoprefixer @tailwindcss/postcss7-compat

# Start development server
npm start
```

### Configuration

1. **Configure Tailwind CSS** (if not auto-configured):
   ```bash
   # Create config files
   npx tailwindcss init -p
   ```

2. **Update `src/index.css`**:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

3. **Launch Application**:
   ```bash
   npm start
   ```
   Opens automatically at `http://localhost:3000`

## 📱 **Usage Guide**

### Adding New Team Members
1. Click **"Add New Team Member"**
2. Fill required fields (marked with *)
3. Click **"Add Team Member"**
4. Start checking off completed tasks

### Managing Progress
- ✅ **Check tasks** by clicking the circles
- 📝 **Edit information** using the edit button
- 💾 **Save changes** using the save button
- 📧 **Send reports** via email button
- 🖨️ **Print reports** using print button

### Email Reports
1. Click the **mail icon** next to any team member
2. Your device's email app opens automatically
3. Report is pre-formatted and ready to send
4. Add restaurant email in team member profile for auto-addressing

### Data Management
- **Auto-Save**: Click "Save Data" to persist changes
- **Export**: Use "Export All" to backup data as JSON
- **Import**: Upload JSON files to restore data
- **Archive**: Use "Complete & Archive" for finished onboarding

## 🏢 **Multi-Restaurant Setup**

The app is designed to be easily customizable for different restaurant brands:

### Current Configuration
- **Title**: "605 Team Member Onboarding Tracker"
- **Processes**: Based on Chili's official procedures
- **Branding**: Red color scheme matching restaurant theme

### Customization Options
- Update app title in `src/App.js`
- Modify color scheme in Tailwind classes
- Adjust checklist items for different procedures
- Customize email templates and report formats

## 📋 **Onboarding Checklist Overview**

### Step 1: Setting Up New TM (12 tasks)
- Call candidate and extend offer
- Provide start date and overview
- KROW system setup
- Oracle configuration
- Schedule VFDO training

### Step 2: Prior to First Day (2 tasks)
- Verify onboarding completion
- Assign job codes and pay rates

### Step 3: Prepare Materials (6 tasks)
- Training materials preparation
- Welcome gifts and supplies
- System access setup

### Step 4: First Day (16 tasks)
- Welcome and introduction
- System training and setup
- Documentation completion
- Training path initialization

### Step 5: Post First Day (4 tasks)
- Gratshare enablement
- Webinar scheduling
- Survey completion
- Final verification

## 🔧 **Development**

### Project Structure
```
src/
├── App.js              # Main application component
├── index.js            # React DOM entry point
├── index.css           # Tailwind CSS imports
└── components/         # Future component organization
```

### Key Functions
- `addTeamMember()` - Creates new team member with validation
- `updateChecklist()` - Manages task completion status
- `generateEmailBody()` - Formats email reports
- `printReport()` - Creates print-ready documents
- `saveData()` - Persists data to localStorage

### State Management
- **React useState** for component state
- **localStorage** for data persistence
- **useEffect** for data loading and change tracking

## 🚢 **Deployment**

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel

# Follow prompts for configuration
```

### Netlify
```bash
# Build production version
npm run build

# Deploy build folder to Netlify
# Or connect GitHub repo for auto-deployment
```

### Traditional Hosting
```bash
# Create production build
npm run build

# Upload 'build' folder contents to web server
```

## 🔐 **Data & Privacy**

- **Local Storage Only**: No data sent to external servers
- **Browser-Based**: All data stays on user's device
- **Offline Capable**: Works without internet connection
- **Export/Import**: Full data control and portability

## 🛠️ **Troubleshooting**

### Common Issues

**App not styled properly:**
```bash
# Ensure Tailwind is configured
npm install -D tailwindcss postcss autoprefixer
# Check src/index.css has @tailwind directives
```

**Icons not showing:**
```bash
# Install lucide-react
npm install lucide-react
```

**Build errors:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Performance Tips
- Use "Save Data" regularly to prevent data loss
- Export data weekly for backups
- Archive completed team members to improve performance
- Clear browser cache if experiencing issues

## 🤝 **Contributing**

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **Chili's Restaurant Management** for providing comprehensive onboarding procedures
- **React Community** for excellent documentation and support
- **Tailwind CSS** for beautiful, responsive design system
- **Lucide** for clean, professional icons

## 📞 **Support**

For issues, questions, or feature requests:
- Open an issue on GitHub
- Contact: [johnohhh1@proton.me]


---

**Built with ❤️ for restaurant management teams everywhere**

*Making team member onboarding simple, trackable, and efficient.*