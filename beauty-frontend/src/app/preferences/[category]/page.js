'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function Preferences() {
  const params = useParams();
  const router = useRouter();
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const category = params.category;

  const preferenceOptions = {
    hair: ['Dry Scalp', 'Color Treated', 'Curly Hair', 'Fine Hair'],
    makeup: ['Natural Look', 'Full Coverage', 'Vegan Products'],
    skincare: ['Sensitive Skin', 'Anti-Aging', 'Acne-Prone']
  };

  const handlePreferenceToggle = (pref) => {
    setSelectedPreferences(prev => 
      prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, preferences: selectedPreferences })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get recommendations');
      }

      if (!Array.isArray(data)) {
        throw new Error('Invalid response format');
      }

      // Base64 encode the products data
      const encodedProducts = btoa(JSON.stringify(data));
      router.push(`/results?products=${encodedProducts}&category=${category}`);
      
    } catch (err) {
      console.error('API Error:', err);
      setError(err.message || 'Failed to process recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <button 
        onClick={() => router.push('/')}
        className="mb-8 text-indigo-600 hover:text-indigo-700"
      >
        ← Back to Categories
      </button>

      <div className="max-w-2xl mx-auto">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <h1 className="text-3xl font-bold mb-6">
          {category?.charAt(0).toUpperCase() + category?.slice(1)} Preferences
        </h1>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div className="grid gap-4 mb-8">
            {preferenceOptions[category]?.map((pref) => (
              <label key={pref} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedPreferences.includes(pref)}
                  onChange={() => handlePreferenceToggle(pref)}
                  className="h-5 w-5 rounded border-gray-300"
                />
                <span>{pref}</span>
              </label>
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading || selectedPreferences.length === 0}
            className="w-full py-3 px-6 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Get Recommendations'}
          </button>
        </form>
      </div>
    </div>
  );
}