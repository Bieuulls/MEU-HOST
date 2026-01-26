import React, { useState } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { Filter, ChevronDown } from 'lucide-react';

interface FilterOption {
  id: string;
  label: string;
  options: string[];
}

const filterOptions: FilterOption[] = [
  {
    id: 'category',
    label: 'Category',
    options: ['All', 'Electronics', 'Clothing', 'Books', 'Home & Garden']
  },
  {
    id: 'price',
    label: 'Price Range',
    options: ['All', 'Under $25', '$25 to $50', '$50 to $100', 'Over $100']
  },
  {
    id: 'sort',
    label: 'Sort By',
    options: ['Featured', 'Price: Low to High', 'Price: High to Low', 'Newest']
  }
];

export const Catalog: React.FC = () => {
  const { theme } = useTheme();
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const handleFilterChange = (filterId: string, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterId]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Product Catalog</h1>
          <p className="mt-2 text-gray-600">Browse through our collection of premium products</p>
        </div>

        {/* Filters and Products Grid */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              {filterOptions.map((filter) => (
                <div key={filter.id} className="border-b pb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">{filter.label}</h3>
                  <div className="space-y-2">
                    {filter.options.map((option) => (
                      <label key={option} className="flex items-center">
                        <input
                          type="radio"
                          name={filter.id}
                          value={option}
                          checked={activeFilters[filter.id] === option}
                          onChange={() => handleFilterChange(filter.id, option)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-600">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Filters Button */}
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="lg:hidden flex items-center justify-center w-full px-4 py-2 bg-white border rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Filter className="w-5 h-5 mr-2" />
            Filters
            <ChevronDown className={`w-5 h-5 ml-2 transform transition-transform ${mobileFiltersOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Mobile Filters Panel */}
          {mobileFiltersOpen && (
            <div className="lg:hidden border rounded-md shadow-sm bg-white p-4 mb-4">
              <div className="space-y-6">
                {filterOptions.map((filter) => (
                  <div key={filter.id}>
                    <h3 className="text-sm font-medium text-gray-900 mb-4">{filter.label}</h3>
                    <div className="space-y-2">
                      {filter.options.map((option) => (
                        <label key={option} className="flex items-center">
                          <input
                            type="radio"
                            name={filter.id}
                            value={option}
                            checked={activeFilters[filter.id] === option}
                            onChange={() => handleFilterChange(filter.id, option)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-600">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-w-1 aspect-h-1">
                    <img
                      src={`/images/products/product-${index + 1}.jpg`}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-900">Premium Product {index + 1}</h3>
                    <p className="mt-1 text-sm text-gray-500">Category</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">$99.99</span>
                      <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};