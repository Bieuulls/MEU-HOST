import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../../contexts/ThemeContext';

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    price: number;
    originalPrice?: number;
    image: string;
    discount?: number;
    rating?: number;
    reviewCount?: number;
  };
  layout?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, layout = 'grid' }) => {
  const { theme } = useTheme();
  const { product: settings } = theme.featuredProducts;

  return (
    <Link to={`/products/${product.id}`} className="block">
      <div className="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
      <div className="relative overflow-hidden rounded-t-xl">
        {product.discount && (
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              -{product.discount}%
            </span>
          </div>
        )}
        <img
          src={product.image}
          alt={product.title}
          className="w-full aspect-square object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
      </div>
      <div className="p-4">
        {settings.title.show && (
          <h3
            className={`text-${settings.title.fontSize} font-${settings.title.fontWeight} text-${settings.title.alignment} truncate`}
            style={{ color: settings.title.color }}
          >
            {product.title}
          </h3>
        )}
        {settings.price.show && (
          <div className="mt-2 flex items-center justify-between">
            <p
              className={`text-${settings.price.fontSize} font-${settings.price.fontWeight}`}
              style={{ color: settings.price.color }}
            >
              {product.originalPrice && (
                <span className="text-gray-400 line-through mr-2">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
              <span className="text-blue-600 font-bold">
                ${product.price.toFixed(2)}
              </span>
            </p>
            {product.rating && (
              <div className="flex items-center">
                <span className="text-yellow-400">
                  {'★'.repeat(Math.floor(product.rating))}
                </span>
                <span className="text-gray-300">
                  {'★'.repeat(5 - Math.floor(product.rating))}
                </span>
                {product.reviewCount && (
                  <span className="text-gray-500 text-sm ml-1">({product.reviewCount})</span>
                )}
              </div>
            )}
          </div>
        )}
        {settings.button.show && (
          <button
            className={`
              mt-4 w-full rounded-lg px-4 py-2 font-medium
              transform transition-all duration-200 hover:scale-[1.02]
              ${settings.button.style === 'primary' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}
              ${settings.button.size === 'medium' ? 'text-sm' : 'text-xs'}
            `}
          >
            {settings.button.text}
          </button>
        )}
      </div>
    </div>
    </Link>
  );
};