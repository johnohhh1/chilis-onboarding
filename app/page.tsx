import React from 'react';
import { neon } from '@neondatabase/serverless';

export default function Page() {
  async function create(formData: FormData) {
    'use server';
    try {
      // Connect to the Neon database
      const sql = neon(process.env.DATABASE_URL || '');
      const comment = formData.get('comment');
      // Insert the comment from the form into the Postgres database
      await sql('INSERT INTO comments (comment) VALUES ($1)', [comment]);
    } catch (error) {
      console.error('Database error:', error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Chili's Onboarding</h1>
        <p className="text-gray-600 mb-4">Database is connected! Try adding a comment below.</p>
        <form action={create} className="space-y-4">
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
              Add a comment
            </label>
            <input 
              type="text" 
              placeholder="Write a comment" 
              name="comment" 
              id="comment"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
} 