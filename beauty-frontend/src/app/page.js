'use client';
import { useState } from 'react';
import Link from 'next/link';
import './globals.css'; // Importa o arquivo CSS global
import './Home.css'; // Importa o CSS específico da Home

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false); // Estado para o modo escuro

  const categories = [
    { id: 'hair', name: 'Cabelos', description: 'Encontre a rotina perfeita para seus cabelos' },
    { id: 'makeup', name: 'Maquiagem', description: 'Descubra a maquiagem ideal para você' },
    { id: 'skincare', name: 'Skincare', description: 'Cuide da sua pele com a melhor rotina' },
  ];

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  return (
    <div className={`home-container ${isDarkMode ? 'dark' : ''}`}>
      <h1 className="home-title">
        Encontre Sua Rotina de Beleza Perfeita
      </h1>

      <button 
        onClick={toggleDarkMode}
        className="toggle-button"
        aria-label="Alternar modo escuro"
      >
        {isDarkMode ? '🌙' : '☀️'} {/* Lua para modo escuro, sol para modo claro */}
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
