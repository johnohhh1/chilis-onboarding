import React, { useState, useEffect } from 'react';
import ApplicantList from './components/ApplicantList';
import ApplicantDetail from './components/ApplicantDetail';
import AddApplicantModal from './components/AddApplicantModal';
import ReportsPanel from './components/ReportsPanel';
import './App.css';

function App() {
  const [applicants, setApplicants] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch applicants on component mount
  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/applicants');
      if (!response.ok) throw new Error('Failed to fetch applicants');
      const data = await response.json();
      setApplicants(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddApplicant = async (applicantData) => {
    try {
      const response = await fetch('/api/applicants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applicantData)
      });
      
      if (!response.ok) throw new Error('Failed to add applicant');
      
      const newApplicant = await response.json();
      setApplicants([newApplicant, ...applicants]);
      setShowAddModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateProgress = async (applicantId, stepId, status, notes = '') => {
    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicant_id: applicantId,
          step_id: stepId,
          status,
          notes,
          completed_by: 'Current User' // In a real app, this would come from auth
        })
      });
      
      if (!response.ok) throw new Error('Failed to update progress');
      
      // Refresh applicant data
      if (selectedApplicant && selectedApplicant.id === applicantId) {
        const updatedApplicant = await fetch(`/api/applicants?id=${applicantId}`);
        const applicantData = await updatedApplicant.json();
        setSelectedApplicant(applicantData);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteApplicant = async (applicantId) => {
    if (!window.confirm('Are you sure you want to delete this applicant?')) return;
    
    try {
      const response = await fetch(`/api/applicants?id=${applicantId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete applicant');
      
      setApplicants(applicants.filter(a => a.id !== applicantId));
      if (selectedApplicant && selectedApplicant.id === applicantId) {
        setSelectedApplicant(null);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Chili's Onboarding...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-red-600">Chili's Onboarding</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowReports(!showReports)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  showReports 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {showReports ? 'Hide Reports' : 'Show Reports'}
              </button>
              
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
              >
                Add New Hire
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Applicant List */}
          <div className="lg:col-span-1">
            <ApplicantList
              applicants={applicants}
              selectedApplicant={selectedApplicant}
              onSelectApplicant={setSelectedApplicant}
              onDeleteApplicant={handleDeleteApplicant}
            />
          </div>

          {/* Right Panel - Applicant Detail or Reports */}
          <div className="lg:col-span-2">
            {showReports ? (
              <ReportsPanel applicants={applicants} />
            ) : selectedApplicant ? (
              <ApplicantDetail
                applicant={selectedApplicant}
                onUpdateProgress={handleUpdateProgress}
                onRefresh={() => {
                  fetchApplicants();
                  setSelectedApplicant(null);
                }}
              />
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select an Applicant</h3>
                <p className="text-gray-500">Choose a new hire from the list to view their onboarding progress</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add Applicant Modal */}
      {showAddModal && (
        <AddApplicantModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddApplicant}
        />
      )}
    </div>
  );
}

export default App;
