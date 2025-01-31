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
      hairTypes: ['Liso', 'Ondulado', 'Cacheado', 'Crespo'],
      hairTextures: ['Fino', 'Médio', 'Grosso'],
      hairLengths: ['Curto', 'Médio', 'Longo'],
      scalpTypes: ['Seco', 'Oleoso', 'Normal'],
      concerns: ['Caspa', 'Queda de Cabelo', 'Frizz', 'Pontas Duplas'],
      wantedProducts: ['Shampoo', 'Condicionador', 'Produtos de Estilo', 'Óleo Capilar'],
    },
    makeup: {
      skinShades: ['Clara', 'Média', 'Morena', 'Escura'],
      foundationTypes: ['Líquido', 'Pó', 'Creme'],
      correctiveTypes: ['Corretivo', 'Corretor de Cor'],
      eyeMakeupTypes: ['Sombra', 'Delineador', 'Rímel'],
      lipMakeupTypes: ['Batom', 'Gloss Labial', 'Hidratante Labial'],
      concerns: ['Acne', 'Sensibilidade', 'Olheiras'],
      wantedFinish: ['Mate', 'Brilho'],
      allergies: ['Fragrância', 'Parabenos', 'Sulfatos'],
    },
    skincare: {
      skinTypes: ['Oleosa', 'Seca', 'Mista', 'Sensível'],
      skinConcerns: ['Acne', 'Rugas', 'Manchas Escuras', 'Vermelhidão'],
      skincareRoutine: ['Limpeza', 'Tônico', 'Hidratante', 'Protetor Solar'],
      ingredientPreferences: ['Ácido Hialurônico', 'Retinol', 'Vitamina C'],
      wantedResults: ['Hidratação', 'Clareamento', 'Antienvelhecimento'],
      spf: ['Sim', 'Não'],
      naturalOrOrganic: ['Natural', 'Orgânico'],
    },
  };

  const handlePreferenceToggle = (pref) => {
    setSelectedPreferences((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('https://nodejs-backend-zh31.vercel.app/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-vercel-protection-bypass': '1ABqrgstckMqjPj4wwyJAq3K0q133JSJ',
        },
        body: JSON.stringify({
          category,
          preferences: selectedPreferences,
          minPrice,
          maxPrice,
        }),
      });

      const text = await response.text();
      console.log('Response text:', text);

      const data = JSON.parse(text);

      if (!response.ok) {
        throw new Error(data.error || 'Falha em obter recomendações');
      }

      if (!Array.isArray(data)) {
        throw new Error('Formato de dados de produto inválido');
      }

      // Base64 encode the products data using encodeURIComponent
      const encodedProducts = btoa(encodeURIComponent(JSON.stringify(data)));
      router.push(`/results?products=${encodedProducts}&category=${category}`);
    } catch (err) {
      console.error('API Error:', err);
      setError(err.message || 'Falha em obter recomendações');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  // Mapping for category titles
  const categoryTitles = {
    hair: 'Preferências de Cabelo',
    makeup: 'Preferências de Maquiagem',
    skincare: 'Preferências de Skincare',
  };

  return (
    <div className={`preferences-container ${isDarkMode ? 'dark' : ''}`}>
      <button onClick={() => router.push('/')} className="back-button">
        ← Voltar para Categorias
      </button>

      <button onClick={toggleDarkMode} className="toggle-button" aria-label="Mudar para modo claro/escuro">
        {isDarkMode ? '🌙' : '☀️'} {/* Lua para modo escuro, sol para modo claro */}
      </button>

      <div className="form-container">
        {error && <div className="error-message">{error}</div>}

        <h1 className="title">
          {categoryTitles[category] || 'Preferências'}
        </h1>

        <form onSubmit={handleSubmit} className="preferences-form">
          <div className="preferences-list">
            {category === 'hair' && (
              <>
                <label>
                  Tipo de Cabelo:
                  <select onChange={(e) => handlePreferenceToggle(e.target.value)}>
                    <option value="">Selecione o tipo de cabelo</option>
                    {preferenceOptions.hair.hairTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Textura do Cabelo:
                  <select onChange={(e) => handlePreferenceToggle(e.target.value)}>
                    <option value="">Selecione a textura do cabelo</option>
                    {preferenceOptions.hair.hairTextures.map((texture) => (
                      <option key={texture} value={texture}>
                        {texture}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Comprimento do Cabelo:
                  <select onChange={(e) => handlePreferenceToggle(e.target.value)}>
                    <option value="">Selecione o comprimento do cabelo</option>
                    {preferenceOptions.hair.hairLengths.map((length) => (
                      <option key={length} value={length}>
                        {length}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Tipo de Couro Cabeludo:
                  <select onChange={(e) => handlePreferenceToggle(e.target.value)}>
                    <option value="">Selecione o tipo de couro cabeludo</option>
                    {preferenceOptions.hair.scalpTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </label>

                <label>Preocupações:</label>
                {preferenceOptions.hair.concerns.map((concern) => (
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
                  Produtos Desejados:
                  <select onChange={(e) => handlePreferenceToggle(e.target.value)}>
                    <option value="">Selecione os produtos desejados</option>
                    {preferenceOptions.hair.wantedProducts.map((product) => (
                      <option key={product} value={product}>
                        {product}
                      </option>
                    ))}
                  </select>
                </label>
              </>
            )}

            {category === 'makeup' && (
              <>
                <label>
                  Tom de Pele:
                  <select onChange={(e) => handlePreferenceToggle(e.target.value)}>
                    <option value="">Selecione o tom de pele</option>
                    {preferenceOptions.makeup.skinShades.map((shade) => (
                      <option key={shade} value={shade}>
                        {shade}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Tipo de Base:
                  <select onChange={(e) => handlePreferenceToggle(e.target.value)}>
                    <option value="">Selecione o tipo de base</option>
                    {preferenceOptions.makeup.foundationTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Corretivo:
                  <select onChange={(e) => handlePreferenceToggle(e.target.value)}>
                    <option value="">Selecione o tipo de corretivo</option>
                    {preferenceOptions.makeup.correctiveTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </label>

                <label>Tipos de Maquiagem para Olhos:</label>
                {preferenceOptions.makeup.eyeMakeupTypes.map((type) => (
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

                <label>Preocupações:</label>
                {preferenceOptions.makeup.concerns.map((concern) => (
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
                  Acabamento Desejado:
                  <select onChange={(e) => handlePreferenceToggle(e.target.value)}>
                    <option value="">Selecione o acabamento</option>
                    {preferenceOptions.makeup.wantedFinish.map((finish) => (
                      <option key={finish} value={finish}>
                        {finish}
                      </option>
                    ))}
                  </select>
                </label>

                <label>Alergias:</label>
                {preferenceOptions.makeup.allergies.map((allergy) => (
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
                  Tipo de Pele:
                  <select onChange={(e) => handlePreferenceToggle(e.target.value)}>
                    <option value="">Selecione o tipo de pele</option>
                    {preferenceOptions.skincare.skinTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </label>

                <label>Preocupações com a Pele:</label>
                {preferenceOptions.skincare.skinConcerns.map((concern) => (
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
                  Rotina de Cuidados com a Pele:
                  <select onChange={(e) => handlePreferenceToggle(e.target.value)}>
                    <option value="">Selecione a rotina</option>
                    {preferenceOptions.skincare.skincareRoutine.map((routine) => (
                      <option key={routine} value={routine}>
                        {routine}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Preferências de Ingredientes:
                  <select onChange={(e) => handlePreferenceToggle(e.target.value)}>
                    <option value="">Selecione os ingredientes</option>
                    {preferenceOptions.skincare.ingredientPreferences.map((ingredient) => (
                      <option key={ingredient} value={ingredient}>
                        {ingredient}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Resultados Desejados:
                  <select onChange={(e) => handlePreferenceToggle(e.target.value)}>
                    <option value="">Selecione os resultados</option>
                    {preferenceOptions.skincare.wantedResults.map((result) => (
                      <option key={result} value={result}>
                        {result}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  FPS:
                  <select onChange={(e) => handlePreferenceToggle(e.target.value)}>
                    <option value="">Selecione a preferência de FPS</option>
                    {preferenceOptions.skincare.spf.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Natural ou Orgânico:
                  <select onChange={(e) => handlePreferenceToggle(e.target.value)}>
                    <option value="">Selecione a preferência</option>
                    {preferenceOptions.skincare.naturalOrOrganic.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              </>
            )}

            {/* Min-Max Price Slider */}
            <div className="price-range">
              <label>Faixa de Preço:</label>
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
                <span>Preço Mínimo: R${minPrice}</span>
                <span>Preço Máximo: R${maxPrice}</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || selectedPreferences.length === 0}
            className="submit-button"
          >
            {isLoading ? 'Carregando...' : 'Obter Recomendações'}
          </button>
        </form>
      </div>
    </div>
  );
}
