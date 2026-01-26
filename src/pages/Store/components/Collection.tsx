import React, { useState } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { ProductCard } from './ProductCard';

interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  discount?: number;
  rating?: number;
  reviewCount?: number;
}

interface CollectionProps {
  title?: string;
  products: Product[];
  showFilters?: boolean;
}

export const Collection: React.FC<CollectionProps> = ({
  title = 'Collection',
  products = [],
  showFilters = true
}) => {
  const { theme } = useTheme();
  const { collections: settings } = theme;
  const [sortBy, setSortBy] = useState('featured');

  const getSortedProducts = () => {
    switch (sortBy) {
      case 'price-low':
        return [...products].sort((a, b) => a.price - b.price);
      case 'price-high':
        return [...products].sort((a, b) => b.price - a.price);
      case 'name':
        return [...products].sort((a, b) => a.title.localeCompare(b.title));
      default:
        return products;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {showFilters && (
          <div className="flex items-center space-x-4">
            <label className="text-sm text-gray-600">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name</option>
            </select>
          </div>
        )}
      </div>

      <div
        className={`grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-${settings.itemsPerRow} xl:grid-cols-${settings.itemsPerRow}`}
        style={{ backgroundColor: settings.backgroundColor }}
      >
        {getSortedProducts().map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found in this collection.</p>
        </div>
      )}
    </div>
  );
};