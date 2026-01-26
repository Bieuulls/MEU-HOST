import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../../contexts/ThemeContext';

interface TabItem {
  id: string;
  text: string;
}

export const FeaturedProducts: React.FC = () => {
  const { theme } = useTheme();
  const { featuredProducts: settings } = theme;
  const [activeTab, setActiveTab] = useState(settings.tabs.items[0].id);

  if (!settings.enabled) return null;

  // Mock product data
  const products = [
    {
      id: "1",
      title: "Premium Product 1",
      price: 99.99,
      originalPrice: 129.99,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
      discount: 20,
      rating: 4.5,
      reviewCount: 24
    },
    {
      id: "2",
      title: "Premium Product 2",
      price: 89.99,
      originalPrice: 119.99,
      image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12",
      discount: 25,
      rating: 4.2,
      reviewCount: 18
    },
    {
      id: "3",
      title: "Premium Product 3",
      price: 79.99,
      originalPrice: 99.99,
      image: "https://images.unsplash.com/photo-1581539250439-c96689b516dd",
      discount: 20,
      rating: 4.8,
      reviewCount: 32
    },
    {
      id: "4",
      title: "Premium Product 4",
      price: 69.99,
      originalPrice: 89.99,
      image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f",
      discount: 22,
      rating: 4.3,
      reviewCount: 15
    }
  ];

  return (
    <section
      className={`py-${settings.spacing.top} pb-${settings.spacing.bottom}`}
      style={{ backgroundColor: settings.backgroundColor }}
    >
      <div className="container mx-auto px-4">
        {settings.header.show && (
          <h2
            className={`
              text-${settings.header.fontSize}
              font-${settings.header.fontWeight}
              text-${settings.header.alignment}
              mb-${settings.header.marginBottom}
              relative inline-block
            `}
          >
            {settings.header.text}
            <span className="absolute bottom-0 left-0 w-1/3 h-1 bg-blue-600 rounded-full"></span>
          </h2>
        )}

        {settings.tabs.show && (
          <div className="flex justify-center mb-8">
            <div
              className={`inline-flex rounded-lg p-1 ${settings.tabs.style.type === 'pills' ? 'bg-gray-100' : 'border-b'}`}
              style={{ backgroundColor: settings.tabs.style.backgroundColor }}
            >
              {settings.tabs.items.map((tab: TabItem) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    px-6 py-2 text-sm font-medium transition-all duration-200 rounded-md
                    ${activeTab === tab.id ? 'shadow-md transform scale-105' : ''}
                  `}
                  style={{
                    backgroundColor: activeTab === tab.id ? settings.tabs.style.activeColor : 'transparent',
                    color: activeTab === tab.id ? '#fff' : settings.tabs.style.inactiveColor
                  }}
                >
                  {tab.text}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className={`grid gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-${settings.layout.columns.desktop}`}>
          {products.map((product, index) => (
            <Link
              to={`/product/${product.id}`}
              key={product.id}
              className="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="relative overflow-hidden rounded-t-xl">
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">-{product.discount}%</span>
                </div>
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full aspect-square object-cover transform group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.src = `https://via.placeholder.co/400x400/e2e8f0/64748b?text=Product+${index + 1}`;
                  }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
              </div>
              <div className="p-4">
                {settings.product.title.show && (
                  <h3
                    className={`text-${settings.product.title.fontSize} font-${settings.product.title.fontWeight} text-${settings.product.title.alignment} truncate`}
                    style={{ color: settings.product.title.color }}
                  >
                    {product.title}
                  </h3>
                )}
                {settings.product.price.show && (
                  <div className="mt-2 flex items-center justify-between">
                    <p
                      className={`text-${settings.product.price.fontSize} font-${settings.product.price.fontWeight}`}
                      style={{ color: settings.product.price.color }}
                    >
                      <span className="text-gray-400 line-through mr-2">${product.originalPrice.toFixed(2)}</span>
                      <span className="text-blue-600 font-bold">${product.price.toFixed(2)}</span>
                    </p>
                    <div className="flex items-center">
                      <span className="text-yellow-400">{'★'.repeat(Math.floor(product.rating))}</span>
                      <span className="text-gray-300">{'★'.repeat(5 - Math.floor(product.rating))}</span>
                      <span className="text-gray-500 text-sm ml-1">({product.reviewCount})</span>
                    </div>
                  </div>
                )}
                {settings.product.button.show && (
                  <button
                    className={`
                      mt-4 w-full rounded-lg px-4 py-2 font-medium
                      transform transition-all duration-200 hover:scale-[1.02]
                      ${settings.product.button.style === 'primary' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}
                      ${settings.product.button.size === 'medium' ? 'text-sm' : 'text-xs'}
                    `}
                    onClick={(e) => {
                      e.preventDefault(); // Prevent link navigation
                      // Add to cart functionality would go here
                      console.log('Add to cart:', product.id);
                    }}
                  >
                    {settings.product.button.text}
                  </button>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};