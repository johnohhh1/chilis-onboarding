import React, { useState } from 'react';

function ReportsPanel({ applicants }) {
  const [selectedReport, setSelectedReport] = useState('summary');
  const [exportFormat, setExportFormat] = useState('csv');

  const generateReport = () => {
    const reportData = {
      summary: generateSummaryReport(),
      pending: generatePendingReport(),
      completion: generateCompletionReport()
    };

    const data = reportData[selectedReport];
    exportReport(data, exportFormat);
  };

  const generateSummaryReport = () => {
    return applicants.map(applicant => ({
      'Name': `${applicant.first_name} ${applicant.last_name}`,
      'Position': applicant.position,
      'Location': applicant.restaurant_location,
      'Completion %': `${applicant.completion_percentage || 0}%`,
      'Completed Steps': applicant.completed_steps || 0,
      'Total Steps': applicant.total_steps || 0,
      'In Progress': applicant.in_progress_steps || 0,
      'Pending': applicant.pending_steps || 0,
      'Hire Date': applicant.hire_date || 'Not set'
    }));
  };

  const generatePendingReport = () => {
    const pendingData = [];
    applicants.forEach(applicant => {
      if (applicant.pending_steps > 0) {
        pendingData.push({
          'Name': `${applicant.first_name} ${applicant.last_name}`,
          'Position': applicant.position,
          'Location': applicant.restaurant_location,
          'Pending Steps': applicant.pending_steps,
          'Completion %': `${applicant.completion_percentage || 0}%`,
          'Hire Date': applicant.hire_date || 'Not set'
        });
      }
    });
    return pendingData;
  };

  const generateCompletionReport = () => {
    return applicants
      .filter(applicant => applicant.completion_percentage >= 80)
      .map(applicant => ({
        'Name': `${applicant.first_name} ${applicant.last_name}`,
        'Position': applicant.position,
        'Location': applicant.restaurant_location,
        'Completion %': `${applicant.completion_percentage || 0}%`,
        'Completed Steps': applicant.completed_steps || 0,
        'Total Steps': applicant.total_steps || 0,
        'Hire Date': applicant.hire_date || 'Not set'
      }));
  };

  const exportReport = (data, format) => {
    if (format === 'csv') {
      exportToCSV(data);
    } else if (format === 'json') {
      exportToJSON(data);
    }
  };

  const exportToCSV = (data) => {
    if (data.length === 0) {
      alert('No data to export');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedReport}_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToJSON = (data) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedReport}_report_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getReportStats = () => {
    const totalApplicants = applicants.length;
    const completedApplicants = applicants.filter(a => (a.completion_percentage || 0) >= 100).length;
    const inProgressApplicants = applicants.filter(a => {
      const percentage = a.completion_percentage || 0;
      return percentage > 0 && percentage < 100;
    }).length;
    const pendingApplicants = applicants.filter(a => (a.completion_percentage || 0) === 0).length;

    return { totalApplicants, completedApplicants, inProgressApplicants, pendingApplicants };
  };

  const stats = getReportStats();

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Reports & Analytics</h2>
        <p className="text-sm text-gray-500">Generate reports and export data</p>
      </div>

      {/* Statistics Cards */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.totalApplicants}</div>
            <div className="text-sm text-blue-600">Total New Hires</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.completedApplicants}</div>
            <div className="text-sm text-green-600">Completed</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{stats.inProgressApplicants}</div>
            <div className="text-sm text-yellow-600">In Progress</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{stats.pendingApplicants}</div>
            <div className="text-sm text-red-600">Not Started</div>
          </div>
        </div>

        {/* Report Configuration */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Type
            </label>
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="summary">Summary Report (All Applicants)</option>
              <option value="pending">Pending Steps Report</option>
              <option value="completion">Completion Report (80%+)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Export Format
            </label>
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
            </select>
          </div>

          <button
            onClick={generateReport}
            className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Generate & Export Report
          </button>
        </div>

        {/* Report Preview */}
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Report Preview</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600">
              {selectedReport === 'summary' && (
                <p>Summary report will include all {applicants.length} applicants with their completion percentages and step counts.</p>
              )}
              {selectedReport === 'pending' && (
                <p>Pending report will show {applicants.filter(a => (a.pending_steps || 0) > 0).length} applicants with incomplete steps.</p>
              )}
              {selectedReport === 'completion' && (
                <p>Completion report will show {applicants.filter(a => (a.completion_percentage || 0) >= 80).length} applicants with 80%+ completion.</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => {
                setSelectedReport('pending');
                generateReport();
              }}
              className="text-left p-3 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100"
            >
              <div className="text-sm font-medium text-yellow-800">Export Pending Tasks</div>
              <div className="text-xs text-yellow-600">Quick export of incomplete steps</div>
            </button>
            
            <button
              onClick={() => {
                setSelectedReport('completion');
                generateReport();
              }}
              className="text-left p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100"
            >
              <div className="text-sm font-medium text-green-800">Export Completed</div>
              <div className="text-xs text-green-600">Quick export of completed onboarding</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportsPanel; 