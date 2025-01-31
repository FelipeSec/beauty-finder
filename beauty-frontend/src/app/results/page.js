'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './Results.css'; // Import the CSS file

export default function Results() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false); // State for dark mode

  useEffect(() => {
    const getProducts = () => {
      try {
        const productsParam = new URLSearchParams(window.location.search).get('products');
        
        if (!productsParam) {
          throw new Error('No products found');
        }

        // Base64 decoding with decodeURIComponent
        const decoded = decodeURIComponent(atob(productsParam));
        const parsed = JSON.parse(decoded);

        if (!Array.isArray(parsed)) {
          throw new Error('Invalid product data format');
        }

        setProducts(parsed);
      } catch (error) {
        console.error('Decoding error:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    getProducts();
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const handleProductSelect = (productId) => {
    router.push(`/products/${productId}`); // Navigate to the product details page
  };

  if (isLoading) {
    return (
      <div className={`results-container ${isDarkMode ? 'dark' : ''} loading`}>
        <div className="loading-message">Loading recommendations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`results-container ${isDarkMode ? 'dark' : ''}`}>
        <div className="error-message">
          {error}
        </div>
        <button
          onClick={() => router.push('/')}
          className="start-over-button"
        >
          ← Start Over
        </button>
      </div>
    );
  }

  return (
    <div className={`results-container ${isDarkMode ? 'dark' : ''}`}>
      <button
        onClick={() => router.push('/')}
        className="start-over-button"
      >
        Start Over
      </button>

      <button 
        onClick={toggleDarkMode}
        className="toggle-button"
        aria-label="Toggle dark mode"
      >
        {isDarkMode ? '🌙' : '☀️'} {/* Moon for dark mode, sun for light mode */}
      </button>

      <h1 className="title">
        Produtos Recomendados
      </h1>

      <div className="products-grid">
        {products.map((product, index) => (
          <div key={index} className="product-card">
            <div className="product-header">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-brand">{product.brand}</p>
            </div>
            
            <p className="product-description">{product.description}</p>
            
            <div className="product-footer">
              <div>
                <span className="product-price">R$ {product.price}</span>
                <span className="currency"></span>
              </div>
              <span className="recommended-badge">
                Recomendado
              </span>
            </div>
            
            {product.whyRecommend && (
              <div className="recommendation-reason">
                <p>
                  <span className="reason-label">Motivo:</span> {product.whyRecommend}
                </p>
              </div>
            )}

            {/* Button to select the product */}
            <button 
              onClick={() => handleProductSelect(product.id)} // Assuming product has an id property
              className="select-product-button"
            >
              Selecionar Produto
            </button>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="no-recommendations">
          No recommendations found. Please try different preferences.
        </div>
      )}
    </div>
  );
}
