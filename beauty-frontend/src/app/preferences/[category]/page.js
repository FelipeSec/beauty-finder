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
  const [minPrice, setMinPrice] = useState(0); // State for minimum price
  const [maxPrice, setMaxPrice] = useState(100); // State for maximum price
  const category = params.category;

  // Expanded preference options
  const preferenceOptions = {
    hair: {
      hairTypes: ['Straight', 'Wavy', 'Curly', 'Coily'],
      hairTextures: ['Fine', 'Medium', 'Thick'],
      hairLengths: ['Short', 'Medium', 'Long'],
      scalpTypes: ['Dry', 'Oily', 'Normal'],
      concerns: ['Dandruff', 'Hair Loss', 'Frizz', 'Split Ends'],
      wantedProducts: ['Shampoo', 'Conditioner', 'Styling Products', 'Hair Oil'],
    },
    makeup: {
      skinShades: ['Fair', 'Medium', 'Tan', 'Deep'],
      foundationTypes: ['Liquid', 'Powder', 'Cream'],
      correctiveTypes: ['Concealer', 'Color Corrector'],
      eyeMakeupTypes: ['Eyeshadow', 'Eyeliner', 'Mascara'],
      lipMakeupTypes: ['Lipstick', 'Lip Gloss', 'Lip Balm'],
      concerns: ['Acne', 'Sensitivity', 'Dark Circles'],
      wantedFinish: ['Matte', 'Glow'],
      allergies: ['Fragrance', 'Parabens', 'Sulfates'],
    },
    skincare: {
      skinTypes: ['Oily', 'Dry', 'Combination', 'Sensitive'],
      skinConcerns: ['Acne', 'Wrinkles', 'Dark Spots', 'Redness'],
      skincareRoutine: ['Cleanser', 'Toner', 'Moisturizer', 'Sunscreen'],
      ingredientPreferences: ['Hyaluronic Acid', 'Retinol', 'Vitamin C'],
      wantedResults: ['Hydration', 'Brightening', 'Anti-Aging'],
      spf: ['Yes', 'No'],
      naturalOrOrganic: ['Natural', 'Organic'],
    },
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
        body: JSON.stringify({ category, preferences: selectedPreferences, minPrice, maxPrice })
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
            {category === 'hair' && (
              <>
                <label>
                  Hair Type:
                  <select onChange={(e) => handlePreferenceToggle(e.target.value)}>
                    <option value="">Select Hair Type</option>
                    {preferenceOptions.hair.hairTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </label>

                <label>
                  Hair Texture:
                  <select onChange={(e) => handlePreferenceToggle(e.target.value)}>
                    <option value="">Select Hair Texture</option>
                    {preferenceOptions.hair.hairTextures.map(texture => (
                      <option key={texture} value={texture}>{texture}</option>
                    ))}
                  </select>
                </label>

                <label>
                  Hair Length:
                  <select onChange={(e) => handlePreferenceToggle(e.target.value)}>
                    <option value="">Select Hair Length</option>
                    {preferenceOptions.hair.hairLengths.map(length => (
                      <option key={length} value={length}>{length}</option>
                    ))}
                  </select>
                </label>

                <label>
                  Scalp Type:
                  <select onChange={(e) => handlePreferenceToggle(e.target.value)}>
                    <option value="">Select Scalp Type</option>
                    {preferenceOptions.hair.scalpTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </label>

                <label>Concerns:</label>
                {preferenceOptions.hair.concerns.map(concern => (
                  <label key={concern} className="preference-item">
                    <input
                      type="checkbox"
                      checked={selectedPreferences.includes(concern)}
                      onChange={() => handlePreferenceToggle(concern)}
                      className="preference-checkbox"
                    />
                    <span>{concern}</span>
                  </label>
                ))}

                <label>
                  Wanted Products:
                  <select onChange={(e) => handlePreferenceToggle(e.target.value)}>
                    <option value="">Select Wanted Products</option>
                    {preferenceOptions.hair.wantedProducts.map(product => (
                      <option key={product} value={product}>{product}</option>
                    ))}
                  </select>
                </label>
              </>
            )}

            {category === 'makeup' && (
              <>
                <label>
                  Skin Shade:
                  <select onChange={(e) => handlePreferenceToggle(e.target.value)}>
                    <option value="">Select Skin Shade</option>
                    {preferenceOptions.makeup.skinShades.map(shade => (
                      <option key={shade} value={shade}>{shade}</option>
                    ))}
                  </select>
                </label>

                <label>
                  Type of Foundation:
                  <select onChange={(e) => handlePreferenceToggle(e.target.value)}>
                    <option value="">Select Foundation Type</option>
                    {preferenceOptions.makeup.foundationTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </label>

                <label>
                  Corrective:
                  <select onChange={(e) => handlePreferenceToggle(e.target.value)}>
                    <option value="">Select Corrective Type</option>
                    {preferenceOptions.makeup.correctiveTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </label>

                <label>Eye Makeup Types:</label>
                {preferenceOptions.makeup.eyeMakeupTypes.map(type => (
                  <label key={type} className="preference-item">
                    <input
                      type="checkbox"
                      checked={selectedPreferences.includes(type)}
                      onChange={() => handlePreferenceToggle(type)}
                      className="preference-checkbox"
                    />
                    <span>{type}</span>
                  </label>
                ))}

                <label>Concerns:</label>
                {preferenceOptions.makeup.concerns.map(concern => (
                  <label key={concern} className="preference-item">
                    <input
                      type="checkbox"
                      checked={selectedPreferences.includes(concern)}
                      onChange={() => handlePreferenceToggle(concern)}
                      className="preference-checkbox"
                    />
                    <span>{concern}</span>
                  </label>
                ))}

                <label>
                  Wanted Finish:
                  <select onChange={(e) => handlePreferenceToggle(e.target.value)}>
                    <option value="">Select Finish</option>
                    {preferenceOptions.makeup.wantedFinish.map(finish => (
                      <option key={finish} value={finish}>{finish}</option>
                    ))}
                  </select>
                </label>

                <label>Allergies:</label>
                {preferenceOptions.makeup.allergies.map(allergy => (
                  <label key={allergy} className="preference-item">
                    <input
                      type="checkbox"
                      checked={selectedPreferences.includes(allergy)}
                      onChange={() => handlePreferenceToggle(allergy)}
                      className="preference-checkbox"
                    />
                    <span>{allergy}</span>
                  </label>
                ))}
              </>
            )}

            {category === 'skincare' && (
              <>
                <label>
                  Skin Type:
                  <select onChange={(e) => handlePreferenceToggle(e.target.value)}>
                    <option value="">Select Skin Type</option>
                    {preferenceOptions.skincare.skinTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </label>

                <label>Skin Concerns:</label>
                {preferenceOptions.skincare.skinConcerns.map(concern => (
                  <label key={concern} className="preference-item">
                    <input
                      type="checkbox"
                      checked={selectedPreferences.includes(concern)}
                      onChange={() => handlePreferenceToggle(concern)}
                      className="preference-checkbox"
                    />
                    <span>{concern}</span>
                  </label>
                ))}

                <label>
                  Skincare Routine:
                  <select onChange={(e) => handlePreferenceToggle(e.target.value)}>
                    <option value="">Select Routine</option>
                    {preferenceOptions.skincare.skincareRoutine.map(routine => (
                      <option key={routine} value={routine}>{routine}</option>
                    ))}
                  </select>
                </label>

                <label>
                  Ingredient Preferences:
                  <select onChange={(e) => handlePreferenceToggle(e.target.value)}>
                    <option value="">Select Ingredients</option>
                    {preferenceOptions.skincare.ingredientPreferences.map(ingredient => (
                      <option key={ingredient} value={ingredient}>{ingredient}</option>
                    ))}
                  </select>
                </label>

                <label>
                  Wanted Results:
                  <select onChange={(e) => handlePreferenceToggle(e.target.value)}>
                    <option value="">Select Results</option>
                    {preferenceOptions.skincare.wantedResults.map(result => (
                      <option key={result} value={result}>{result}</option>
                    ))}
                  </select>
                </label>

                <label>
                  SPF:
                  <select onChange={(e) => handlePreferenceToggle(e.target.value)}>
                    <option value="">Select SPF Preference</option>
                    {preferenceOptions.skincare.spf.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>

                <label>
                  Natural or Organic:
                  <select onChange={(e) => handlePreferenceToggle(e.target.value)}>
                    <option value="">Select Preference</option>
                    {preferenceOptions.skincare.naturalOrOrganic.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>
              </>
            )}

            {/* Min-Max Price Slider */}
            <div className="price-range">
              <label>Price Range:</label>
              <input
                type="range"
                min="0"
                max="100"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="price-slider"
              />
              <input
                type="range"
                min="0"
                max="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="price-slider"
              />
              <div>
                <span>Min Price: ${minPrice}</span>
                <span>Max Price: ${maxPrice}</span>
              </div>
            </div>
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
