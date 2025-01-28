'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Results() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const getProducts = () => {
      try {
        const productsParam = new URLSearchParams(window.location.search).get('products');
        
        if (!productsParam) {
          throw new Error('No products found');
        }

        // Base64 decoding
        const decoded = atob(productsParam);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-indigo-600 text-lg font-medium">Loading recommendations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
            {error}
          </div>
          <button
            onClick={() => router.push('/')}
            className="text-indigo-600 hover:text-indigo-700"
          >
            ← Start Over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => router.push('/')}
          className="mb-8 text-indigo-600 hover:text-indigo-700 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Start Over
        </button>

        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Recommended Products
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                <p className="text-gray-600 text-sm mt-1">{product.brand}</p>
              </div>
              
              <p className="text-gray-700 text-sm mb-4">{product.description}</p>
              
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-indigo-600 font-medium">${product.price}</span>
                  <span className="text-gray-500 text-sm ml-2">USD</span>
                </div>
                <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                  Recommended
                </span>
              </div>
              
              {product.whyRecommend && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Why:</span> {product.whyRecommend}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No recommendations found. Please try different preferences.
          </div>
        )}
      </div>
    </div>
  );
}