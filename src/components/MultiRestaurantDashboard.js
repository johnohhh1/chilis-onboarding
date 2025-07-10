import React, { useState, useEffect } from 'react';
import { Building2, Users, CheckCircle, Clock, TrendingUp, BarChart3 } from 'lucide-react';
import { useRestaurant } from '../contexts/RestaurantContext';

const MultiRestaurantDashboard = () => {
  const { restaurants, getRestaurantStats } = useRestaurant();
  const [allStats, setAllStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  useEffect(() => {
    loadAllStats();
  }, [restaurants]);

  const loadAllStats = async () => {
    try {
      setLoading(true);
      const stats = await getRestaurantStats();
      if (stats) {
        setAllStats(stats);
      }
    } catch (error) {
      console.error('Error loading restaurant stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTotalStats = () => {
    return allStats.reduce((totals, stat) => ({
      total_members: totals.total_members + (stat.total_members || 0),
      active_members: totals.active_members + (stat.active_members || 0),
      completed_members: totals.completed_members + (stat.completed_members || 0),
      pending_members: totals.pending_members + (stat.pending_members || 0)
    }), {
      total_members: 0,
      active_members: 0,
      completed_members: 0,
      pending_members: 0
    });
  };

  const totalStats = getTotalStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        <span className="ml-3 text-gray-600">Loading restaurant statistics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Multi-Restaurant Overview</h2>
            <p className="text-gray-600 mt-1">
              Managing {restaurants.length} restaurant{restaurants.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center space-x-2 text-red-600">
            <Building2 className="h-6 w-6" />
            <span className="font-semibold">Chili's Network</span>
          </div>
        </div>
      </div>

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Members</p>
              <p className="text-2xl font-bold text-gray-900">{totalStats.total_members}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{totalStats.completed_members}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{totalStats.pending_members}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">{totalStats.active_members}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Restaurant List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Restaurant Performance</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {allStats.map((stat) => (
            <div
              key={stat.restaurant_id}
              className="px-6 py-4 hover:bg-gray-50 cursor-pointer"
              onClick={() => setSelectedRestaurant(stat)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <Building2 className="h-5 w-5 text-red-600" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {stat.restaurant_name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        Store #{stat.store_number}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Active</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {stat.active_members || 0}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Completed</p>
                    <p className="text-sm font-semibold text-green-600">
                      {stat.completed_members || 0}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Pending</p>
                    <p className="text-sm font-semibold text-yellow-600">
                      {stat.pending_members || 0}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {stat.total_members || 0}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Progress Bar */}
              {stat.total_members > 0 && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Completion Rate</span>
                    <span>
                      {Math.round(((stat.completed_members || 0) / stat.total_members) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${((stat.completed_members || 0) / stat.total_members) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Restaurant Details Modal */}
      {selectedRestaurant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedRestaurant.restaurant_name} Details
              </h3>
              <button
                onClick={() => setSelectedRestaurant(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Store Number</p>
                <p className="text-sm text-gray-900">{selectedRestaurant.store_number}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Members</p>
                <p className="text-sm text-gray-900">{selectedRestaurant.total_members || 0}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Active Members</p>
                <p className="text-sm text-gray-900">{selectedRestaurant.active_members || 0}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-sm text-green-600">{selectedRestaurant.completed_members || 0}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-sm text-yellow-600">{selectedRestaurant.pending_members || 0}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Completion Rate</p>
                <p className="text-sm text-gray-900">
                  {selectedRestaurant.total_members > 0 
                    ? `${Math.round(((selectedRestaurant.completed_members || 0) / selectedRestaurant.total_members) * 100)}%`
                    : '0%'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={() => setSelectedRestaurant(null)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiRestaurantDashboard; 