'use client';
import { useState } from 'react';
import Link from 'next/link';
import './globals.css'; // Import the global CSS file
import './Home.css'; // Import the Home-specific CSS file

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false); // State for dark mode

  const categories = [
    { id: 'hair', name: 'Hair', description: 'Discover your perfect hair routine' },
    { id: 'makeup', name: 'Makeup', description: 'Discover your perfect makeup routine' },
    { id: 'skincare', name: 'Skincare', description: 'Discover your perfect skincare routine' },
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
          >
            <h2 className="category-name">{category.name}</h2>
            <p className="category-description">{category.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
