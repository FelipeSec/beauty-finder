'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import './Preferences.css'; // Import the CSS file

export default function Preferences() {
  const params = useParams();
  const router = useRouter();
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false); // State for dark mode
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

      const text = await response.text();
      console.log('Response text:', text);

      const data = JSON.parse(text);

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

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  return (
    <div className={`preferences-container ${isDarkMode ? 'dark' : ''}`}>
      <button 
        onClick={() => router.push('/')}
        className="back-button"
      >
        ← Back to Categories
      </button>

      <button 
        onClick={toggleDarkMode}
        className="toggle-button"
        aria-label="Toggle dark mode"
      >
        {isDarkMode ? '🌙' : '☀️'} {/* Moon for dark mode, sun for light mode */}
      </button>

      <div className="form-container">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <h1 className="title">
          {category?.charAt(0).toUpperCase() + category?.slice(1)} Preferences
        </h1>

        <form onSubmit={handleSubmit} className="preferences-form">
          <div className="preferences-list">
            {preferenceOptions[category]?.map((pref) => (
              <label key={pref} className="preference-item">
                <input
                  type="checkbox"
                  checked={selectedPreferences.includes(pref)}
                  onChange={() => handlePreferenceToggle(pref)}
                  className="preference-checkbox"
                />
                <span>{pref}</span>
              </label>
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading || selectedPreferences.length === 0}
            className="submit-button"
          >
            {isLoading ? 'Loading...' : 'Get Recommendations'}
          </button>
        </form>
      </div>
    </div>
  );
}
