import React, { useState } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';

interface ProductDetailsProps {
  product: {
    id: string;
    title: string;
    price: number;
    originalPrice?: number;
    description?: string;
    images: string[];
    discount?: number;
    rating?: number;
    reviewCount?: number;
    specifications?: {
      name: string;
      value: string;
    }[];
    variants?: {
      name: string;
      options: string[];
    }[];
  };
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const { theme } = useTheme();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);

  const handleVariantChange = (variantName: string, option: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [variantName]: option
    }));
  };

  const handleQuantityChange = (value: number) => {
    if (value >= 1) setQuantity(value);
  };

  const handleAddToCart = () => {
    const productToAdd = {
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.images[0],
      quantity,
      variants: selectedVariants
    };

    console.log('Adding to cart:', productToAdd);
    // Here you would dispatch to your cart context or state management

    // Show a temporary success message
    const successMessage = document.createElement('div');
    successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in';
    successMessage.textContent = 'Product added to cart!';
    document.body.appendChild(successMessage);

    setTimeout(() => {
      successMessage.classList.add('opacity-0', 'transition-opacity', 'duration-500');
      setTimeout(() => document.body.removeChild(successMessage), 500);
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
            <img
              src={product.images[selectedImage]}
              alt={product.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = `https://via.placeholder.co/600x600/e2e8f0/64748b?text=${encodeURIComponent(product.title)}`;
              }}
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square rounded-md overflow-hidden border-2 ${
                  selectedImage === index ? 'border-blue-600' : 'border-transparent'
                }`}
              >
                <img
                  src={image}
                  alt={`${product.title} ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = `https://via.placeholder.co/150x150/e2e8f0/64748b?text=Image+${index + 1}`;
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>

          <div className="flex items-center space-x-4">
            <div className="flex items-baseline space-x-2">
              {product.originalPrice && (
                <span className="text-gray-400 line-through text-lg">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
              <span className="text-2xl font-bold text-blue-600">
                ${product.price.toFixed(2)}
              </span>
            </div>
            {product.discount && (
              <span className="bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">
                -{product.discount}%
              </span>
            )}
          </div>

          {product.rating && (
            <div className="flex items-center space-x-2">
              <div className="flex text-yellow-400">
                {'★'.repeat(Math.floor(product.rating))}
                <span className="text-gray-300">
                  {'★'.repeat(5 - Math.floor(product.rating))}
                </span>
              </div>
              {product.reviewCount && (
                <span className="text-gray-500">({product.reviewCount} reviews)</span>
              )}
            </div>
          )}

          {product.description && (
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          )}

          {/* Variants */}
          {product.variants?.map((variant) => (
            <div key={variant.name} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {variant.name}
              </label>
              <div className="flex flex-wrap gap-2">
                {variant.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleVariantChange(variant.name, option)}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      selectedVariants[variant.name] === option
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Quantity */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Quantity
            </label>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
                disabled={quantity <= 1}
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                className="w-20 text-center border rounded-md py-2"
                min="1"
              />
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Add to Cart
          </button>

          {/* Specifications */}
          {product.specifications && (
            <div className="border-t pt-6 mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Specifications</h3>
              <dl className="grid grid-cols-1 gap-4">
                {product.specifications.map((spec) => (
                  <div key={spec.name} className="flex justify-between">
                    <dt className="text-gray-600">{spec.name}</dt>
                    <dd className="text-gray-900 font-medium">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};