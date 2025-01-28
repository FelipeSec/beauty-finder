import Link from 'next/link';
import './globals.css';

export default function Home() {
  const categories = [
    { id: 'hair', name: 'Hair', description: 'Discover your perfect hair routine' },
    { id: 'makeup', name: 'Makeup', description: 'Discover your perfect makeup routine' },
    { id: 'skincare', name: 'Skincare', description: 'Discover your perfect skincare routine' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">
        Discover Your Perfect Beauty Routine
      </h1>
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {categories.map((category) => (
          <Link 
            key={category.id}
            href={`/preferences/${category.id}`}
            className="block bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow duration-300"
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">{category.name}</h2>
            <p className="text-gray-600">{category.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}