import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { LogOut, User } from 'lucide-react';
import MultiRestaurantDashboard from './components/MultiRestaurantDashboard';
import RestaurantSelector from './components/RestaurantSelector';
import { useRestaurant } from './contexts/RestaurantContext';

function App({ session }) {
  const { selectedRestaurant, setSelectedRestaurant } = useRestaurant();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/signin' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Chili's Onboarding...</p>
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
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{session?.user?.username}</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {session?.user?.access === 'admin' ? 'Admin' : 'Restaurant'}
                </span>
              </div>
              
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {session?.user?.access === 'admin' ? (
          <MultiRestaurantDashboard />
        ) : (
          <div>
            <RestaurantSelector />
            {selectedRestaurant && (
              <div className="mt-8">
                <MultiRestaurantDashboard />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
