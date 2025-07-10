import React, { useState } from 'react';
import { ChevronDown, Building2, Plus } from 'lucide-react';
import { useRestaurant } from '../contexts/RestaurantContext';

const RestaurantSelector = () => {
  const { 
    restaurants, 
    selectedRestaurant, 
    setSelectedRestaurant, 
    loading, 
    createRestaurant 
  } = useRestaurant();
  
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRestaurant, setNewRestaurant] = useState({
    name: '',
    store_number: '',
    address: '',
    manager_name: '',
    manager_email: '',
    phone: '',
    capacity: '',
    opening_hours: ''
  });

  const handleRestaurantSelect = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowDropdown(false);
  };

  const handleAddRestaurant = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!newRestaurant.name || !newRestaurant.store_number) {
      alert('Restaurant name and store number are required');
      return;
    }

    const result = await createRestaurant(newRestaurant);
    
    if (result.success) {
      setShowAddForm(false);
      setNewRestaurant({
        name: '',
        store_number: '',
        address: '',
        manager_name: '',
        manager_email: '',
        phone: '',
        capacity: '',
        opening_hours: ''
      });
      alert('Restaurant created successfully!');
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
        <span className="text-sm text-gray-600">Loading restaurants...</span>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Restaurant Selector Button */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
      >
        <Building2 className="h-4 w-4 text-red-600" />
        <span className="text-sm font-medium text-gray-900">
          {selectedRestaurant ? selectedRestaurant.name : 'Select Restaurant'}
        </span>
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </button>

      {/* Dropdown Menu */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {/* Restaurant List */}
          {restaurants.map((restaurant) => (
            <button
              key={restaurant.id}
              onClick={() => handleRestaurantSelect(restaurant)}
              className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${
                selectedRestaurant?.id === restaurant.id ? 'bg-red-50 text-red-700' : 'text-gray-700'
              }`}
            >
              <div className="font-medium">{restaurant.name}</div>
              <div className="text-xs text-gray-500">
                Store #{restaurant.store_number}
              </div>
            </button>
          ))}
          
          {/* Add New Restaurant Button */}
          <div className="border-t border-gray-200">
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Restaurant</span>
            </button>
          </div>
        </div>
      )}

      {/* Add Restaurant Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Add New Restaurant</h3>
            
            <form onSubmit={handleAddRestaurant} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Restaurant Name *
                </label>
                <input
                  type="text"
                  required
                  value={newRestaurant.name}
                  onChange={(e) => setNewRestaurant(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Chili's - Downtown"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Store Number *
                </label>
                <input
                  type="text"
                  required
                  value={newRestaurant.store_number}
                  onChange={(e) => setNewRestaurant(prev => ({ ...prev, store_number: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="C00605"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={newRestaurant.address}
                  onChange={(e) => setNewRestaurant(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="123 Main St, Downtown, TX 75001"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Manager Name
                  </label>
                  <input
                    type="text"
                    value={newRestaurant.manager_name}
                    onChange={(e) => setNewRestaurant(prev => ({ ...prev, manager_name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="John Smith"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Manager Email
                  </label>
                  <input
                    type="email"
                    value={newRestaurant.manager_email}
                    onChange={(e) => setNewRestaurant(prev => ({ ...prev, manager_email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="john.smith@chilis.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={newRestaurant.phone}
                    onChange={(e) => setNewRestaurant(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Capacity
                  </label>
                  <input
                    type="number"
                    value={newRestaurant.capacity}
                    onChange={(e) => setNewRestaurant(prev => ({ ...prev, capacity: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="150"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Opening Hours
                </label>
                <input
                  type="text"
                  value={newRestaurant.opening_hours}
                  onChange={(e) => setNewRestaurant(prev => ({ ...prev, opening_hours: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="11:00 AM - 10:00 PM"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Add Restaurant
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantSelector; 