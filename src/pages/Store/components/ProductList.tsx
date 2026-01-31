import React, { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import { useTheme } from '../../../contexts/ThemeContext';
import type { Product as ProductType } from '../../../types';
import { strapiClient } from '../../../lib/strapiClient';

// Interface for the product data structure used in this component
interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  discount?: number;
  rating?: number;
  reviewCount?: number;
  category?: string;
}

interface ProductListProps {
  initialProducts?: Product[];
  layout?: 'grid' | 'list';
  showFilters?: boolean;
  showSort?: boolean;
}

export const ProductList: React.FC<ProductListProps> = ({
  initialProducts = [],
  layout = 'grid',
  showFilters = true,
  showSort = true
}) => {
  const { theme } = useTheme();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'name_asc' | 'name_desc'>('name_asc');
  const [filters, setFilters] = useState({
    priceRange: { min: 0, max: 1000 },
    categories: [] as string[],
    rating: 0
  });

  // Fetch available categories for filtering
  const [availableCategories, setAvailableCategories] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await strapiClient.get('/api/categories');
        if (response.data && response.data.data) {
          setAvailableCategories(response.data.data.map((category: any) => ({
            id: category.id,
            name: category.attributes.name
          })));
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        if (initialProducts && initialProducts.length > 0) {
          // Use initial products if provided
          setProducts(initialProducts);
        } else {
          // Fetch products from API
          const response = await strapiClient.get('/api/products');
          if (response.data && response.data.data) {
            const formattedProducts = response.data.data.map((item: any) => {
              const attrs = item.attributes;
              return {
                id: item.id,
                title: attrs.name,
                price: attrs.price,
                image: attrs.images?.data?.[0]?.attributes?.url || 'https://placehold.co/400',
                category: attrs.categories?.data?.[0]?.attributes?.name,
                rating: attrs.rating || 0,
                reviewCount: attrs.reviewCount || 0,
                stock: attrs.stock || 0
              };
            });
            setProducts(formattedProducts);
          }
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [initialProducts]);

  const sortProducts = (productsToSort: Product[]) => {
    return [...productsToSort].sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'name_asc':
          return a.title.localeCompare(b.title);
        case 'name_desc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });
  };

  const filterProducts = (productsToFilter: Product[]) => {
    return productsToFilter.filter(product => {
      const matchesPrice = product.price >= filters.priceRange.min &&
                          product.price <= filters.priceRange.max;
      const matchesCategory = filters.categories.length === 0 ||
                            (product.category && filters.categories.includes(product.category));
      const matchesRating = product.rating ? product.rating >= filters.rating : true;

      return matchesPrice && matchesCategory && matchesRating;
    });
  };

  const displayedProducts = sortProducts(filterProducts(products));

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="bg-gray-200 rounded-lg h-80">
            <div className="h-48 bg-gray-300 rounded-t-lg"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="h-8 bg-gray-300 rounded w-full mt-2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {(showFilters || showSort) && (
        <div className="flex flex-col md:flex-row justify-between gap-4 p-4 bg-gray-50 rounded-lg">
          {showFilters && (
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={filters.priceRange.min}
                    onChange={e => setFilters(prev => ({
                      ...prev,
                      priceRange: { ...prev.priceRange, min: Number(e.target.value) }
                    }))}
                    className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <span>to</span>
                  <input
                    type="number"
                    value={filters.priceRange.max}
                    onChange={e => setFilters(prev => ({
                      ...prev,
                      priceRange: { ...prev.priceRange, max: Number(e.target.value) }
                    }))}
                    className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              {availableCategories.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categories</label>
                  <div className="flex flex-wrap gap-2">
                    {availableCategories.map(category => (
                      <label key={category.id} className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.categories.includes(category.name)}
                          onChange={() => {
                            setFilters(prev => {
                              const newCategories = prev.categories.includes(category.name)
                                ? prev.categories.filter(c => c !== category.name)
                                : [...prev.categories, category.name];
                              return { ...prev, categories: newCategories };
                            });
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-1 text-sm text-gray-700">{category.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Rating</label>
                <select
                  value={filters.rating}
                  onChange={e => setFilters(prev => ({ ...prev, rating: Number(e.target.value) }))}
                  className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="0">Any</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                  <option value="2">2+ Stars</option>
                </select>
              </div>
            </div>
          )}

          {showSort && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as typeof sortBy)}
                className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="name_asc">Name (A-Z)</option>
                <option value="name_desc">Name (Z-A)</option>
                <option value="price_asc">Price (Low to High)</option>
                <option value="price_desc">Price (High to Low)</option>
              </select>
            </div>
          )}
        </div>
      )}

      {displayedProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found matching your criteria.</p>
        </div>
      ) : (
        <div className={`grid gap-6 ${layout === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1'}`}>
          {displayedProducts.map(product => (
            <ProductCard key={product.id} product={product} layout={layout} />
          ))}
        </div>
      )}
    </div>
  );
};