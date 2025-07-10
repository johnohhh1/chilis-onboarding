import React, { createContext, useContext, useState, useEffect } from 'react';

const RestaurantContext = createContext();

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};

export const RestaurantProvider = ({ children }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API configuration
  const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

  // Load restaurants from API
  const loadRestaurants = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/restaurants`);
      if (response.ok) {
        const data = await response.json();
        setRestaurants(data);
        
        // Set default restaurant if none selected
        if (data.length > 0 && !selectedRestaurant) {
          setSelectedRestaurant(data[0]);
        }
      } else {
        setError('Failed to load restaurants');
      }
    } catch (error) {
      console.error('Error loading restaurants:', error);
      setError('Failed to load restaurants');
    } finally {
      setLoading(false);
    }
  };

  // Create new restaurant
  const createRestaurant = async (restaurantData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/restaurants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(restaurantData)
      });

      if (response.ok) {
        const newRestaurant = await response.json();
        setRestaurants(prev => [...prev, newRestaurant]);
        return { success: true, restaurant: newRestaurant };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.error };
      }
    } catch (error) {
      console.error('Error creating restaurant:', error);
      return { success: false, error: 'Failed to create restaurant' };
    }
  };

  // Get restaurant statistics
  const getRestaurantStats = async (restaurantId = null) => {
    try {
      const url = restaurantId 
        ? `${API_BASE_URL}/restaurant-stats?restaurant_id=${restaurantId}`
        : `${API_BASE_URL}/restaurant-stats`;
      
      const response = await fetch(url);
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Failed to load restaurant stats');
      }
    } catch (error) {
      console.error('Error loading restaurant stats:', error);
      return null;
    }
  };

  // Load restaurants on component mount
  useEffect(() => {
    loadRestaurants();
  }, [loadRestaurants]);

  const value = {
    restaurants,
    selectedRestaurant,
    setSelectedRestaurant,
    loading,
    error,
    loadRestaurants,
    createRestaurant,
    getRestaurantStats
  };

  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  );
}; 