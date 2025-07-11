import React, { useState, useEffect } from 'react';

function ApplicantDetail({ applicant, onUpdateProgress, onRefresh }) {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingStep, setEditingStep] = useState(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (applicant) {
      fetchProgress();
    }
  }, [applicant]);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/progress?applicant_id=${applicant.id}`);
      if (!response.ok) throw new Error('Failed to fetch progress');
      const data = await response.json();
      setProgress(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (stepId, newStatus) => {
    try {
      await onUpdateProgress(applicant.id, stepId, newStatus, notes);
      setEditingStep(null);
      setNotes('');
      fetchProgress(); // Refresh the progress data
    } catch (err) {
      setError(err.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return (
          <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      case 'in_progress':
        return (
          <svg className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const groupByCategory = (progressData) => {
    const grouped = {};
    progressData.forEach(item => {
      if (!grouped[item.category_name]) {
        grouped[item.category_name] = [];
      }
      grouped[item.category_name].push(item);
    });
    return grouped;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-red-600">Error: {error}</div>
        <button 
          onClick={fetchProgress}
          className="mt-2 text-red-600 hover:text-red-800"
        >
          Retry
        </button>
      </div>
    );
  }

  const groupedProgress = groupByCategory(progress);

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Applicant Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {applicant.first_name} {applicant.last_name}
            </h2>
            <p className="text-sm text-gray-500">
              {applicant.position} • {applicant.restaurant_location}
            </p>
            {applicant.email && (
              <p className="text-sm text-gray-500">{applicant.email}</p>
            )}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-red-600">
              {applicant.completion_percentage || 0}%
            </div>
            <div className="text-sm text-gray-500">Complete</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-red-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${applicant.completion_percentage || 0}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>{applicant.completed_steps || 0} completed</span>
            <span>{applicant.total_steps || 0} total steps</span>
          </div>
        </div>
      </div>

      {/* Progress Categories */}
      <div className="divide-y divide-gray-200">
        {Object.entries(groupedProgress).map(([categoryName, steps]) => (
          <div key={categoryName} className="px-6 py-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3">{categoryName}</h3>
            <div className="space-y-3">
              {steps.map((step) => (
                <div key={step.step_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(step.status)}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{step.step_name}</h4>
                        {step.description && (
                          <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                        )}
                        {step.estimated_time_minutes && (
                          <span className="text-xs text-gray-400">
                            Est. {step.estimated_time_minutes} min
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {step.notes && (
                      <div className="mt-2 text-xs text-gray-600 bg-white p-2 rounded">
                        <strong>Notes:</strong> {step.notes}
                      </div>
                    )}
                    
                    {step.completed_by && (
                      <div className="mt-1 text-xs text-gray-500">
                        Completed by: {step.completed_by}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(step.status)}`}>
                      {step.status.replace('_', ' ')}
                    </span>
                    
                    {editingStep === step.step_id ? (
                      <div className="flex items-center space-x-2">
                        <select
                          value={step.status}
                          onChange={(e) => handleStatusUpdate(step.step_id, e.target.value)}
                          className="text-xs border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                        <button
                          onClick={() => setEditingStep(null)}
                          className="text-xs text-gray-500 hover:text-gray-700"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setEditingStep(step.step_id)}
                        className="text-xs text-red-600 hover:text-red-800"
                      >
                        Update
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ApplicantDetail; 