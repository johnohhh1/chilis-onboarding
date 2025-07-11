import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Chili's Onboarding</h1>
        <p className="text-gray-600 text-lg">Welcome to the basic onboarding system</p>
        <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">System Status</h2>
          <p className="text-green-600">✅ Basic system is working</p>
          <p className="text-gray-500 mt-2">No authentication required</p>
        </div>
      </div>
    </div>
  );
}

export default App;
