import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTheme } from '../../../contexts/ThemeContext';

interface ProductData {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  variants?: {
    id: string;
    name: string;
    price: number;
    sku: string;
  }[];
}

export const Product: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { theme } = useTheme();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call
        const mockProduct: ProductData = {
          id: id || '1',
          name: 'Sample Product',
          description: 'This is a sample product description.',
          price: 99.99,
          images: [
            'https://via.placeholder.com/600x800/404040/FFFFFF.png?text=Product+Image+1',
            'https://via.placeholder.com/600x800/404040/FFFFFF.png?text=Product+Image+2',
          ],
        };
        setProduct(mockProduct);
        setSelectedImage(mockProduct.images[0]);
      } catch (err) {
        setError('Failed to load product');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">{error || 'Product not found'}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-w-3 aspect-h-4 rounded-lg overflow-hidden bg-gray-100">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-center object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(image)}
                className={`aspect-w-1 aspect-h-1 rounded-lg overflow-hidden ${selectedImage === image ? 'ring-2 ring-purple-600' : ''}`}
              >
                <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-full object-center object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-xl text-gray-900">${product.price.toFixed(2)}</p>
          <div className="prose prose-sm text-gray-500">
            <p>{product.description}</p>
          </div>
          <button
            type="button"
            className="w-full bg-purple-600 text-white py-3 px-8 rounded-md hover:bg-purple-700 transition-colors duration-200"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};