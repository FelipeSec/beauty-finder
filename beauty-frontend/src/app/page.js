'use client';
import { useState } from 'react';
import Link from 'next/link';
import './globals.css'; // Import the global CSS file
import './Home.css'; // Import the Home-specific CSS file

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false); // State for dark mode

  const categories = [
    { 
      id: 'hair', 
      name: 'Hair', 
      description: 'Discover your perfect hair routine',
      image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388' // Hair image
    },
    { 
      id: 'makeup', 
      name: 'Makeup', 
      description: 'Discover your perfect makeup routine',
      image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796' // Makeup image
    },
    { 
      id: 'skincare', 
      name: 'Skincare', 
      description: 'Discover your perfect skincare routine',
      image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908' // Skincare image
    },
  ];

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  return (
    <div className={`home-container ${isDarkMode ? 'dark' : ''}`}>
      <h1 className="home-title">
        Discover Your Perfect Beauty Routine
      </h1>

      <button 
        onClick={toggleDarkMode}
        className="toggle-button"
        aria-label="Toggle dark mode"
      >
        {isDarkMode ? '🌙' : '☀️'} {/* Moon for dark mode, sun for light mode */}
      </button>

      <div className="categories-grid">
        {categories.map((category) => (
          <Link 
            key={category.id}
            href={`/preferences/${category.id}`}
            className="category-card"
            style={{ backgroundImage: `url(${category.image})` }} // Set background image
          >
            <div className="category-content">
              <h2 className="category-name">{category.name}</h2>
              <p className="category-description">{category.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
