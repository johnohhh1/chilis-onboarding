import React, { useState, useEffect, useCallback } from 'react';
import { Plus, User, Calendar, Phone, CheckCircle, Circle, Printer, Trash2, Edit2, Save, Mail, Download, Clock, AlertCircle } from 'lucide-react';

const OnboardingApp = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [lastSaved, setLastSaved] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [newMember, setNewMember] = useState({
    name: '',
    startDate: '',
    startTime: '',
    phone: '',
    tmId: '',
    position: '',
    restaurantEmail: ''
  });
  const [formErrors, setFormErrors] = useState({});

  const checklistItems = [
    // Step 1: Setting Up New TM
    { id: 'call_offer', step: 1, text: 'Call candidate, extend offer and welcome to team', category: 'setup' },
    { id: 'start_date', step: 1, text: 'Provide start date and First Day overview', category: 'setup' },
    { id: 'zoom_app', step: 1, text: 'Ask TM to download Zoom Workplace app', category: 'setup' },
    { id: 'krow_hire', step: 1, text: 'Change candidate status to "Hire" in KROW', category: 'setup' },
    { id: 'new_hire_app', step: 1, text: 'Complete New Hire Application', category: 'setup' },
    { id: 'oracle_offer', step: 1, text: 'Login to Oracle to create offer and hire', category: 'setup' },
    { id: 'person_number', step: 1, text: 'Obtain and provide TM Person Number', category: 'setup' },
    { id: 'onboarding_journey', step: 1, text: 'Direct TM to complete Onboarding Journey', category: 'setup' },
    { id: 'schedule_vfdo', step: 1, text: 'Schedule VFDO with new TM', category: 'setup' },
    { id: 'i9_documents', step: 1, text: 'Remind TM to bring I-9 documents', category: 'setup' },
    { id: 'headphones_phone', step: 1, text: 'Ask TM to bring headphones and phone', category: 'setup' },
    { id: 'dress_code', step: 1, text: 'Discuss dress code and slip resistant shoes', category: 'setup' },
    
    // Step 2: Prior to First Day
    { id: 'verify_onboarding', step: 2, text: 'Verify TM completed Onboarding', category: 'pre_first_day' },
    { id: 'assign_job_code', step: 2, text: 'Assign correct job codes and pay rate in Oracle', category: 'pre_first_day' },
    
    // Step 3: Prepare Materials
    { id: 'vfd_guide', step: 3, text: 'Ensure VFD Par Guide is ready', category: 'materials' },
    { id: 'first_day_pin', step: 3, text: 'Ensure First Day Pin is ready', category: 'materials' },
    { id: 'hs_welcome_sheet', step: 3, text: 'Print HotSchedules Welcome Sheet', category: 'materials' },
    { id: 'welcome_gift', step: 3, text: 'Assemble Welcome Gift', category: 'materials' },
    { id: 'certified_trainer', step: 3, text: 'Assign Certified Trainer and print Training Schedule', category: 'materials' },
    { id: 'paycard', step: 3, text: 'Gather unactivated Paycard if needed', category: 'materials' },
    
    // Step 4: First Day
    { id: 'clock_in_demo', step: 4, text: 'Demonstrate how to clock-in', category: 'first_day' },
    { id: 'welcome_gift_give', step: 4, text: 'Welcome TM with gift', category: 'first_day' },
    { id: 'complete_i9', step: 4, text: 'Complete I-9 verification', category: 'first_day' },
    { id: 'introduce_team', step: 4, text: 'Introduce new TM to ChiliHead family', category: 'first_day' },
    { id: 'tm_file_folder', step: 4, text: 'Complete TM file folder', category: 'first_day' },
    { id: 'brinker_nation', step: 4, text: 'Set up Brinker Nation login', category: 'first_day' },
    { id: 'activate_paycard', step: 4, text: 'Activate Paycard in Oracle', category: 'first_day' },
    { id: 'oracle_fusion_app', step: 4, text: 'Download Oracle Fusion app and walkthrough', category: 'first_day' },
    { id: 'hs_availability', step: 4, text: 'Fill out availability in HotSchedules', category: 'first_day' },
    { id: 'trainer_intro', step: 4, text: 'Introduce to Certified Trainer', category: 'first_day' },
    { id: 'learning_path', step: 4, text: 'Ensure TM can navigate Learning Path', category: 'first_day' },
    { id: 'zoom_meeting_id', step: 4, text: 'Provide Virtual Meeting ID for Zoom', category: 'first_day' },
    { id: 'vfdo_setup', step: 4, text: 'Set up for VFDO (90 minutes)', category: 'first_day' },
    { id: 'play_restaurant', step: 4, text: 'Verify "Play Restaurant" activity completed', category: 'first_day' },
    { id: 'scavenger_hunt', step: 4, text: 'Verify "Scavenger Hunt" completed', category: 'first_day' },
    { id: 'connection_board', step: 4, text: 'Hang "New to the Crew" on Connection Board', category: 'first_day' },
    { id: 'first_day_modules', step: 4, text: 'Ensure all First Day modules complete', category: 'first_day' },
    
    // Step 5: Post First Day
    { id: 'enable_gratshare', step: 5, text: 'Enable TM in Gratshare after 72 hours', category: 'post_first_day' },
    { id: 'learning_path_complete', step: 5, text: 'Ensure Learning Path complete upon graduation', category: 'post_first_day' },
    { id: 'job_webinar', step: 5, text: 'Schedule job-specific webinar', category: 'post_first_day' },
    { id: 'thirty_day_survey', step: 5, text: 'Complete 30-Day Survey', category: 'post_first_day' }
  ];

  const supplyItems = [
    'TM shirts (various sizes for FOH & HOH)',
    'Hats (for HOH)',
    'Server aprons',
    'Blank TM file folders (DSI)',
    'Training materials (ex: VFD Par Guide)',
    'Pin Program inventory',
    'Welcome gift / swag',
    'Pay cards',
    'Manager / TM swipe cards',
    'iPad cases / straps'
  ];

  // API configuration - use Vercel API routes
  const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

  const saveData = useCallback(async () => {
    try {
      const now = new Date();
      const dataToSave = {
        teamMembers,
        lastSaved: now.toISOString()
      };

      const response = await fetch(`${API_BASE_URL}/onboarding-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSave)
      });

      if (response.ok) {
        setLastSaved(now);
        setHasUnsavedChanges(false);
        console.log('Data saved to server successfully');
      } else {
        console.error('Failed to save data to server');
        // Fallback to localStorage
        localStorage.setItem('chilisOnboardingMembers', JSON.stringify(teamMembers));
        localStorage.setItem('chilisOnboardingLastSaved', now.toISOString());
        setLastSaved(now);
        setHasUnsavedChanges(false);
      }
    } catch (error) {
      console.error('Error saving data:', error);
      // Fallback to localStorage
      const now = new Date();
      localStorage.setItem('chilisOnboardingMembers', JSON.stringify(teamMembers));
      localStorage.setItem('chilisOnboardingLastSaved', now.toISOString());
      setLastSaved(now);
      setHasUnsavedChanges(false);
    }
  }, [teamMembers, API_BASE_URL]);

  // Load data from API on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/onboarding-data`);
        if (response.ok) {
          const data = await response.json();
          setTeamMembers(data.teamMembers || []);
          if (data.lastSaved) {
            setLastSaved(new Date(data.lastSaved));
          }
        } else {
          console.error('Failed to load data from API');
          // Fallback to localStorage if API fails
          const savedMembers = localStorage.getItem('chilisOnboardingMembers');
          const savedTimestamp = localStorage.getItem('chilisOnboardingLastSaved');
          if (savedMembers) {
            setTeamMembers(JSON.parse(savedMembers));
          }
          if (savedTimestamp) {
            setLastSaved(new Date(savedTimestamp));
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to localStorage
        const savedMembers = localStorage.getItem('chilisOnboardingMembers');
        const savedTimestamp = localStorage.getItem('chilisOnboardingLastSaved');
        if (savedMembers) {
          setTeamMembers(JSON.parse(savedMembers));
        }
        if (savedTimestamp) {
          setLastSaved(new Date(savedTimestamp));
        }
      }
    };

    loadData();
  }, [API_BASE_URL]);

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges) {
      const timer = setTimeout(() => {
        saveData();
      }, 2000); // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(timer);
    }
  }, [hasUnsavedChanges, saveData]);

  // Enhanced data persistence with backup
  // const backupData = async () => {
  //   try {
  //     const response = await fetch(`${API_BASE_URL}/backup`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         teamMembers,
  //         lastSaved: lastSaved?.toISOString()
  //       })
  //     });

  //     if (response.ok) {
  //       alert('Backup created successfully!');
  //     } else {
  //       console.error('Failed to create backup');
  //       alert('Failed to create backup. Please try again.');
  //     }
  //   } catch (error) {
  //     console.error('Error creating backup:', error);
  //     alert('Error creating backup. Please try again.');
  //   }
  // };

  const validateForm = () => {
    const errors = {};
    if (!newMember.name.trim()) errors.name = 'Name is required';
    if (!newMember.startDate) errors.startDate = 'Start date is required';
    if (!newMember.startTime) errors.startTime = 'Start time is required';
    if (!newMember.phone.trim()) errors.phone = 'Phone number is required';
    if (!newMember.position.trim()) errors.position = 'Position is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const addTeamMember = () => {
    if (validateForm()) {
      const member = {
        ...newMember,
        id: Date.now().toString(),
        checklist: checklistItems.reduce((acc, item) => {
          acc[item.id] = false;
          return acc;
        }, {}),
        dateAdded: new Date().toISOString(),
        lastModified: new Date().toISOString()
      };
      setTeamMembers([...teamMembers, member]);
      setNewMember({ 
        name: '', 
        startDate: '', 
        startTime: '', 
        phone: '', 
        tmId: '', 
        position: '', 
        restaurantEmail: '' 
      });
      setFormErrors({});
      setShowAddForm(false);
    }
  };

  const updateChecklist = (memberId, itemId, checked) => {
    setTeamMembers(members =>
      members.map(member =>
        member.id === memberId
          ? { 
              ...member, 
              checklist: { ...member.checklist, [itemId]: checked },
              lastModified: new Date().toISOString()
            }
          : member
      )
    );
  };

  const updateMemberInfo = (memberId, field, value) => {
    setTeamMembers(members =>
      members.map(member =>
        member.id === memberId
          ? { 
              ...member, 
              [field]: value,
              lastModified: new Date().toISOString()
            }
          : member
      )
    );
  };

  const deleteMember = (memberId) => {
    setTeamMembers(members => members.filter(member => member.id !== memberId));
  };

  const getCompletionStats = (member) => {
    const completed = Object.values(member.checklist).filter(Boolean).length;
    const total = checklistItems.length;
    return { completed, total, percentage: Math.round((completed / total) * 100) };
  };

  const getRemainingTasks = (member) => {
    return checklistItems.filter(item => !member.checklist[item.id]);
  };

  // Dashboard functions
  const getDashboardStats = () => {
    const total = teamMembers.length;
    const completed = teamMembers.filter(m => getCompletionStats(m).percentage === 100).length;
    const inProgress = teamMembers.filter(m => {
      const stats = getCompletionStats(m);
      return stats.percentage > 0 && stats.percentage < 100;
    }).length;
    const notStarted = teamMembers.filter(m => getCompletionStats(m).percentage === 0).length;
    const overdue = teamMembers.filter(m => {
      const startDate = new Date(m.startDate);
      const today = new Date();
      const daysSinceStart = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
      return daysSinceStart > 7 && getCompletionStats(m).percentage < 100;
    }).length;

    return { total, completed, inProgress, notStarted, overdue };
  };

  // Helper function to get members by status
  // const getMembersByStatus = (status) => {
  //   return teamMembers.filter(member => {
  //     const completedTasks = member.checklist.filter(task => task.completed).length;
  //     const totalTasks = member.checklist.length;
  //     const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  //     
  //     switch (status) {
  //       case 'completed':
  //         return progress === 100;
  //       case 'in-progress':
  //         return progress > 0 && progress < 100;
  //       case 'not-started':
  //         return progress === 0;
  //       default:
  //         return true;
  //     }
  //   });
  // };

  const getUrgentTasks = () => {
    const urgent = [];
    teamMembers.forEach(member => {
      const remaining = getRemainingTasks(member);
      const startDate = new Date(member.startDate);
      const today = new Date();
      const daysSinceStart = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
      
      if (daysSinceStart > 3 && remaining.length > 0) {
        urgent.push({
          member,
          daysOverdue: daysSinceStart,
          remainingTasks: remaining.length
        });
      }
    });
    return urgent.sort((a, b) => b.daysOverdue - a.daysOverdue);
  };

  const generateEmailBody = (member) => {
    const remainingTasks = getRemainingTasks(member);
    const stats = getCompletionStats(member);
    
    let emailBody = `Chili's Team Member Onboarding Report - ${member.name}\n\n`;
    emailBody += `Team Member Information:\n`;
    emailBody += `Name: ${member.name}\n`;
    emailBody += `Start Date: ${member.startDate} at ${member.startTime}\n`;
    emailBody += `Phone: ${member.phone}\n`;
    emailBody += `TM ID: ${member.tmId || 'Not assigned yet'}\n`;
    emailBody += `Position: ${member.position}\n\n`;
    
    emailBody += `Progress Summary:\n`;
    emailBody += `Completed Tasks: ${stats.completed} of ${stats.total} (${stats.percentage}%)\n`;
    emailBody += `Remaining Tasks: ${remainingTasks.length}\n\n`;
    
    if (remainingTasks.length > 0) {
      emailBody += `Tasks Still Needed:\n`;
      remainingTasks.forEach(task => {
        emailBody += `• Step ${task.step}: ${task.text}\n`;
      });
    } else {
      emailBody += `🎉 All onboarding tasks completed!\n`;
    }
    
    emailBody += `\n\nSupply Checklist:\n`;
    supplyItems.forEach(item => {
      emailBody += `☐ ${item}\n`;
    });
    
    emailBody += `\n\nReport generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`;
    
    return encodeURIComponent(emailBody);
  };

  const sendEmail = (member) => {
    const subject = encodeURIComponent(`Onboarding Report - ${member.name} - ${new Date().toLocaleDateString()}`);
    const body = generateEmailBody(member);
    const mailto = `mailto:${member.restaurantEmail || ''}?subject=${subject}&body=${body}`;
    window.location.href = mailto;
  };

  const exportAllData = () => {
    const exportData = {
      teamMembers,
      exportDate: new Date().toISOString(),
      totalMembers: teamMembers.length,
      completedMembers: teamMembers.filter(m => getCompletionStats(m).percentage === 100).length
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chilis-onboarding-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const printReport = (member) => {
    const remainingTasks = getRemainingTasks(member);
    const stats = getCompletionStats(member);
    
    const printContent = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #d32f2f; margin: 0;">Chili's Team Member Onboarding Report</h1>
          <p style="margin: 5px 0; color: #666;">Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
        </div>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <h2 style="margin-top: 0;">Team Member Information</h2>
          <p><strong>Name:</strong> ${member.name}</p>
          <p><strong>Start Date:</strong> ${member.startDate} at ${member.startTime}</p>
          <p><strong>Phone:</strong> ${member.phone}</p>
          <p><strong>TM ID:</strong> ${member.tmId || 'Not assigned yet'}</p>
          <p><strong>Position:</strong> ${member.position}</p>
          <p><strong>Last Modified:</strong> ${new Date(member.lastModified).toLocaleString()}</p>
        </div>
        
        <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <h2 style="margin-top: 0;">Progress Summary</h2>
          <p><strong>Completed Tasks:</strong> ${stats.completed} of ${stats.total} (${stats.percentage}%)</p>
          <p><strong>Remaining Tasks:</strong> ${remainingTasks.length}</p>
        </div>
        
        ${remainingTasks.length > 0 ? `
          <div style="margin-bottom: 30px;">
            <h2>Remaining Tasks</h2>
            <div style="background: #fff3cd; padding: 20px; border-radius: 8px;">
              ${remainingTasks.map(task => `
                <div style="margin-bottom: 15px; padding: 10px; background: white; border-radius: 4px; border-left: 4px solid #ffc107;">
                  <strong>Step ${task.step}:</strong> ${task.text}
                </div>
              `).join('')}
            </div>
          </div>
        ` : `
          <div style="background: #d4edda; padding: 20px; border-radius: 8px; text-align: center;">
            <h2 style="color: #155724; margin-top: 0;">🎉 All Tasks Completed!</h2>
            <p style="color: #155724;">This team member has successfully completed all onboarding steps.</p>
          </div>
        `}
        
        <div style="margin-top: 40px; border-top: 2px solid #ddd; padding-top: 20px;">
          <h2>Supply Checklist</h2>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
            ${supplyItems.map(item => `
              <div style="margin-bottom: 8px; padding: 5px 0; border-bottom: 1px dotted #ccc;">
                ☐ ${item}
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
    
    const printWindow = window.open('', '', 'height=800,width=800');
    printWindow.document.write(`
      <html>
        <head>
          <title>Onboarding Report - ${member.name}</title>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const stepColors = {
    1: 'bg-blue-100 border-blue-300 text-blue-800',
    2: 'bg-green-100 border-green-300 text-green-800',
    3: 'bg-purple-100 border-purple-300 text-purple-800',
    4: 'bg-red-100 border-red-300 text-red-800',
    5: 'bg-orange-100 border-orange-300 text-orange-800'
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          {/* Header Section */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-red-600 mb-4">605 Team Member Onboarding Tracker</h1>
            <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Clock size={16} />
                {lastSaved ? `Last saved: ${lastSaved.toLocaleString()}` : 'Not saved yet'}
              </span>
              {hasUnsavedChanges && (
                <span className="flex items-center gap-1 text-orange-600">
                  <AlertCircle size={16} />
                  Unsaved changes
                </span>
              )}
            </div>
            
            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeTab === 'dashboard' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                📊 Dashboard
              </button>
              <button
                onClick={() => setActiveTab('detail')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeTab === 'detail' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                👥 Team Members
              </button>
            </div>

            {/* Action Buttons - Mobile Friendly */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <button
                onClick={saveData}
                className={`px-4 py-3 rounded-lg flex items-center justify-center gap-2 text-sm font-medium ${
                  hasUnsavedChanges 
                    ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                <Save size={18} />
                Save Data
              </button>
              <button
                onClick={exportAllData}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 text-sm font-medium"
              >
                <Download size={18} />
                Export All
              </button>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 text-sm font-medium sm:col-span-2 lg:col-span-1"
              >
                <Plus size={18} />
                Add New Team Member
              </button>
            </div>
          </div>

          {/* Add New Member Form */}
          {showAddForm && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h2 className="text-xl font-semibold mb-4">Add New Team Member</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="Team Member Name *"
                    value={newMember.name}
                    onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                    className={`w-full border rounded-lg px-3 py-2 ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                </div>
                <div>
                  <input
                    type="date"
                    placeholder="Start Date *"
                    value={newMember.startDate}
                    onChange={(e) => setNewMember({...newMember, startDate: e.target.value})}
                    className={`w-full border rounded-lg px-3 py-2 ${formErrors.startDate ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {formErrors.startDate && <p className="text-red-500 text-xs mt-1">{formErrors.startDate}</p>}
                </div>
                <div>
                  <input
                    type="time"
                    placeholder="Start Time *"
                    value={newMember.startTime}
                    onChange={(e) => setNewMember({...newMember, startTime: e.target.value})}
                    className={`w-full border rounded-lg px-3 py-2 ${formErrors.startTime ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {formErrors.startTime && <p className="text-red-500 text-xs mt-1">{formErrors.startTime}</p>}
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    value={newMember.phone}
                    onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
                    className={`w-full border rounded-lg px-3 py-2 ${formErrors.phone ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Position *"
                    value={newMember.position}
                    onChange={(e) => setNewMember({...newMember, position: e.target.value})}
                    className={`w-full border rounded-lg px-3 py-2 ${formErrors.position ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {formErrors.position && <p className="text-red-500 text-xs mt-1">{formErrors.position}</p>}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="TM ID (if known)"
                    value={newMember.tmId}
                    onChange={(e) => setNewMember({...newMember, tmId: e.target.value})}
                    className="border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Restaurant Email (for reports)"
                    value={newMember.restaurantEmail}
                    onChange={(e) => setNewMember({...newMember, restaurantEmail: e.target.value})}
                    className="border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">* Required fields</p>
              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <button
                  onClick={addTeamMember}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex-1"
                >
                  Add Team Member
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setFormErrors({});
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Dashboard View */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Dashboard Overview */}
              {teamMembers.length > 0 ? (
                <>
                  {/* Enhanced Statistics */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mb-6">
                    <div className="bg-blue-100 p-3 md:p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-800 text-sm md:text-base">Total Members</h3>
                      <p className="text-xl md:text-2xl font-bold text-blue-900">{getDashboardStats().total}</p>
                    </div>
                    <div className="bg-green-100 p-3 md:p-4 rounded-lg">
                      <h3 className="font-semibold text-green-800 text-sm md:text-base">Completed</h3>
                      <p className="text-xl md:text-2xl font-bold text-green-900">{getDashboardStats().completed}</p>
                    </div>
                    <div className="bg-yellow-100 p-3 md:p-4 rounded-lg">
                      <h3 className="font-semibold text-yellow-800 text-sm md:text-base">In Progress</h3>
                      <p className="text-xl md:text-2xl font-bold text-yellow-900">{getDashboardStats().inProgress}</p>
                    </div>
                    <div className="bg-red-100 p-3 md:p-4 rounded-lg">
                      <h3 className="font-semibold text-red-800 text-sm md:text-base">Not Started</h3>
                      <p className="text-xl md:text-2xl font-bold text-red-900">{getDashboardStats().notStarted}</p>
                    </div>
                    <div className="bg-orange-100 p-3 md:p-4 rounded-lg">
                      <h3 className="font-semibold text-orange-800 text-sm md:text-base">Overdue</h3>
                      <p className="text-xl md:text-2xl font-bold text-orange-900">{getDashboardStats().overdue}</p>
                    </div>
                  </div>

                  {/* Urgent Alerts */}
                  {getUrgentTasks().length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                      <h3 className="text-lg font-semibold text-red-800 mb-3">🚨 Urgent Attention Needed</h3>
                      <div className="space-y-2">
                        {getUrgentTasks().slice(0, 3).map(({ member, daysOverdue, remainingTasks }) => (
                          <div key={member.id} className="flex items-center justify-between bg-white p-3 rounded border">
                            <div>
                              <p className="font-medium text-red-800">{member.name}</p>
                              <p className="text-sm text-red-600">
                                {daysOverdue} days overdue • {remainingTasks} tasks remaining
                              </p>
                            </div>
                            <button
                              onClick={() => {
                                // setSelectedMember(member); // This line was removed
                                // setViewMode('detail'); // This line was removed
                              }}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                            >
                              View Details
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-800 mb-3">📋 Recent Additions</h3>
                      <div className="space-y-2">
                        {teamMembers
                          .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
                          .slice(0, 3)
                          .map(member => (
                            <div key={member.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div>
                                <p className="font-medium text-sm">{member.name}</p>
                                <p className="text-xs text-gray-600">{member.position}</p>
                              </div>
                              <button
                                onClick={() => {
                                  // setSelectedMember(member); // This line was removed
                                  // setViewMode('detail'); // This line was removed
                                }}
                                className="text-blue-600 hover:text-blue-800 text-xs"
                              >
                                View
                              </button>
                            </div>
                          ))}
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-800 mb-3">🎯 Almost Complete</h3>
                      <div className="space-y-2">
                        {teamMembers
                          .filter(m => {
                            const stats = getCompletionStats(m);
                            return stats.percentage >= 80 && stats.percentage < 100;
                          })
                          .slice(0, 3)
                          .map(member => {
                            const stats = getCompletionStats(member);
                            return (
                              <div key={member.id} className="flex items-center justify-between p-2 bg-green-50 rounded">
                                <div>
                                  <p className="font-medium text-sm">{member.name}</p>
                                  <p className="text-xs text-green-600">{stats.percentage}% complete</p>
                                </div>
                                <button
                                  onClick={() => {
                                    // setSelectedMember(member); // This line was removed
                                    // setViewMode('detail'); // This line was removed
                                  }}
                                  className="text-green-600 hover:text-green-800 text-xs"
                                >
                                  Complete
                                </button>
                              </div>
                            );
                          })}
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-800 mb-3">📅 Starting Soon</h3>
                      <div className="space-y-2">
                        {teamMembers
                          .filter(m => {
                            const startDate = new Date(m.startDate);
                            const today = new Date();
                            const daysUntilStart = Math.floor((startDate - today) / (1000 * 60 * 60 * 24));
                            return daysUntilStart >= 0 && daysUntilStart <= 7;
                          })
                          .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
                          .slice(0, 3)
                          .map(member => {
                            const startDate = new Date(member.startDate);
                            const today = new Date();
                            const daysUntilStart = Math.floor((startDate - today) / (1000 * 60 * 60 * 24));
                            return (
                              <div key={member.id} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                                <div>
                                  <p className="font-medium text-sm">{member.name}</p>
                                  <p className="text-xs text-blue-600">
                                    {daysUntilStart === 0 ? 'Starting today' : `Starts in ${daysUntilStart} days`}
                                  </p>
                                </div>
                                <button
                                  onClick={() => {
                                    // setSelectedMember(member); // This line was removed
                                    // setViewMode('detail'); // This line was removed
                                  }}
                                  className="text-blue-600 hover:text-blue-800 text-xs"
                                >
                                  Prepare
                                </button>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">👋</div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Chili's Onboarding Tracker</h2>
                  <p className="text-gray-600 mb-6">Start by adding your first team member to begin tracking their onboarding progress.</p>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg text-lg font-medium"
                  >
                    Add Your First Team Member
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Detail View */}
          {activeTab === 'detail' && (
            <>
              {/* Summary Statistics */}
              {teamMembers.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
                  <div className="bg-blue-100 p-3 md:p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800 text-sm md:text-base">Total Members</h3>
                    <p className="text-xl md:text-2xl font-bold text-blue-900">{teamMembers.length}</p>
                  </div>
                  <div className="bg-green-100 p-3 md:p-4 rounded-lg">
                    <h3 className="font-semibold text-green-800 text-sm md:text-base">Completed</h3>
                    <p className="text-xl md:text-2xl font-bold text-green-900">
                      {teamMembers.filter(m => getCompletionStats(m).percentage === 100).length}
                    </p>
                  </div>
                  <div className="bg-yellow-100 p-3 md:p-4 rounded-lg">
                    <h3 className="font-semibold text-yellow-800 text-sm md:text-base">In Progress</h3>
                    <p className="text-xl md:text-2xl font-bold text-yellow-900">
                      {teamMembers.filter(m => {
                        const stats = getCompletionStats(m);
                        return stats.percentage > 0 && stats.percentage < 100;
                      }).length}
                    </p>
                  </div>
                  <div className="bg-red-100 p-3 md:p-4 rounded-lg">
                    <h3 className="font-semibold text-red-800 text-sm md:text-base">Not Started</h3>
                    <p className="text-xl md:text-2xl font-bold text-red-900">
                      {teamMembers.filter(m => getCompletionStats(m).percentage === 0).length}
                    </p>
                  </div>
                </div>
              )}

              {/* Team Members List */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {teamMembers.map(member => {
                  const stats = getCompletionStats(member);
                  const remainingTasks = getRemainingTasks(member);
                  
                  return (
                    <div key={member.id} className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
                      {/* Header with mobile-friendly layout */}
                      <div className="mb-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-3 flex-1">
                            <User className="text-gray-600 mt-1" size={20} />
                            <div className="flex-1 min-w-0">
                              {editingMember === member.id ? (
                                <input
                                  type="text"
                                  value={member.name}
                                  onChange={(e) => updateMemberInfo(member.id, 'name', e.target.value)}
                                  className="border border-gray-300 rounded px-2 py-1 font-semibold w-full"
                                />
                              ) : (
                                <h3 className="text-lg font-semibold break-words">{member.name}</h3>
                              )}
                              
                              {/* Mobile-friendly info layout */}
                              <div className="space-y-1 mt-2">
                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                  <Calendar size={14} />
                                  {editingMember === member.id ? (
                                    <input
                                      type="date"
                                      value={member.startDate}
                                      onChange={(e) => updateMemberInfo(member.id, 'startDate', e.target.value)}
                                      className="border border-gray-300 rounded px-1 py-0.5 text-sm"
                                    />
                                  ) : (
                                    <span className="break-words">{member.startDate} at {member.startTime}</span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                  <Phone size={14} />
                                  {editingMember === member.id ? (
                                    <input
                                      type="tel"
                                      value={member.phone}
                                      onChange={(e) => updateMemberInfo(member.id, 'phone', e.target.value)}
                                      className="border border-gray-300 rounded px-1 py-0.5 text-sm"
                                    />
                                  ) : (
                                    <span className="break-words">{member.phone}</span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500 break-words">
                                  Position: {member.position} | TM ID: {member.tmId || 'Pending'}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Action buttons - mobile friendly */}
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {editingMember === member.id ? (
                              <button
                                onClick={() => setEditingMember(null)}
                                className="text-green-600 hover:text-green-800 p-1"
                                title="Save"
                              >
                                <Save size={18} />
                              </button>
                            ) : (
                              <button
                                onClick={() => setEditingMember(member.id)}
                                className="text-blue-600 hover:text-blue-800 p-1"
                                title="Edit"
                              >
                                <Edit2 size={18} />
                              </button>
                            )}
                            <button
                              onClick={() => sendEmail(member)}
                              className="text-green-600 hover:text-green-800 p-1"
                              title="Send email report"
                            >
                              <Mail size={18} />
                            </button>
                            <button
                              onClick={() => printReport(member)}
                              className="text-gray-600 hover:text-gray-800 p-1"
                              title="Print report"
                            >
                              <Printer size={18} />
                            </button>
                            <button
                              onClick={() => deleteMember(member.id)}
                              className="text-red-600 hover:text-red-800 p-1"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{stats.completed}/{stats.total} ({stats.percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${stats.percentage}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Checklist */}
                      <div className="space-y-2 max-h-80 md:max-h-96 overflow-y-auto">
                        {checklistItems.map(item => (
                          <div key={item.id} className="flex items-start gap-2 p-2 rounded hover:bg-gray-50">
                            <button
                              onClick={() => updateChecklist(member.id, item.id, !member.checklist[item.id])}
                              className="mt-0.5 flex-shrink-0 p-1"
                            >
                              {member.checklist[item.id] ? (
                                <CheckCircle className="text-green-600" size={18} />
                              ) : (
                                <Circle className="text-gray-400" size={18} />
                              )}
                            </button>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap gap-1 mb-1">
                                <span className={`text-xs px-2 py-1 rounded-full border ${stepColors[item.step]}`}>
                                  Step {item.step}
                                </span>
                              </div>
                              <p className={`text-sm ${member.checklist[item.id] ? 'text-gray-500 line-through' : ''} break-words`}>
                                {item.text}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Quick Actions */}
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm text-gray-600 mb-2">
                          {remainingTasks.length > 0 
                            ? `${remainingTasks.length} tasks remaining` 
                            : '🎉 All tasks completed!'}
                        </p>
                        {stats.percentage === 100 && (
                          <button
                            onClick={() => deleteMember(member.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
                          >
                            Complete & Archive
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {teamMembers.length === 0 && (
                <div className="text-center py-12">
                  <User className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-600">No team members added yet. Click "Add New Team Member" to get started.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingApp;
