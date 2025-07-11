import React from 'react';

function ApplicantList({ applicants, selectedApplicant, onSelectApplicant, onDeleteApplicant }) {
  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressBarColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">New Hires</h2>
        <p className="text-sm text-gray-500">{applicants.length} total applicants</p>
      </div>
      
      <div className="divide-y divide-gray-200">
        {applicants.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <div className="text-gray-400 mb-2">
              <svg className="mx-auto h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">No applicants yet</p>
            <p className="text-gray-400 text-xs">Add a new hire to get started</p>
          </div>
        ) : (
          applicants.map((applicant) => {
            const percentage = applicant.completion_percentage || 0;
            const isSelected = selectedApplicant && selectedApplicant.id === applicant.id;
            
            return (
              <div
                key={applicant.id}
                className={`px-6 py-4 cursor-pointer transition-colors ${
                  isSelected ? 'bg-red-50 border-l-4 border-red-500' : 'hover:bg-gray-50'
                }`}
                onClick={() => onSelectApplicant(applicant)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {applicant.first_name} {applicant.last_name}
                      </h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteApplicant(applicant.id);
                        }}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-1">
                      {applicant.position} • {applicant.restaurant_location}
                    </p>
                    
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span className={getProgressColor(percentage)}>
                          {percentage}%
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(percentage)}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>{applicant.completed_steps || 0} completed</span>
                        <span>{applicant.total_steps || 0} total</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default ApplicantList; 