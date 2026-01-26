import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ProductDetails } from './ProductDetails';
import { useTheme } from '../../../contexts/ThemeContext';

interface Product {
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
}

// Mock product database
const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Premium Product 1',
    price: 99.99,
    originalPrice: 129.99,
    description: 'This is a high-quality product with premium features. Made with the finest materials and designed for durability and style.',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f',
      'https://images.unsplash.com/photo-1491553895911-0055eca6402d',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff'
    ],
    discount: 20,
    rating: 4.5,
    reviewCount: 24,
    specifications: [
      { name: 'Material', value: 'Premium Quality' },
      { name: 'Dimensions', value: '10" x 8" x 2"' },
      { name: 'Weight', value: '1.5 lbs' }
    ],
    variants: [
      {
        name: 'Color',
        options: ['Black', 'White', 'Blue']
      },
      {
        name: 'Size',
        options: ['Small', 'Medium', 'Large']
      }
    ]
  },
  {
    id: '2',
    title: 'Premium Product 2',
    price: 89.99,
    originalPrice: 119.99,
    description: 'An elegant and sophisticated product that combines style with functionality. Perfect for everyday use.',
    images: [
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12',
      'https://images.unsplash.com/photo-1560343090-f0409e92791a',
      'https://images.unsplash.com/photo-1564466809058-bf4114d55352',
      'https://images.unsplash.com/photo-1526947425960-945c6e72858f'
    ],
    discount: 25,
    rating: 4.2,
    reviewCount: 18,
    specifications: [
      { name: 'Material', value: 'High-Grade' },
      { name: 'Dimensions', value: '12" x 6" x 3"' },
      { name: 'Weight', value: '2.0 lbs' }
    ],
    variants: [
      {
        name: 'Color',
        options: ['Red', 'Green', 'Yellow']
      },
      {
        name: 'Size',
        options: ['Standard', 'Large', 'Extra Large']
      }
    ]
  },
  {
    id: '3',
    title: 'Premium Product 3',
    price: 79.99,
    originalPrice: 99.99,
    description: 'A versatile and practical product designed for comfort and convenience. Ideal for both home and office use.',
    images: [
      'https://images.unsplash.com/photo-1581539250439-c96689b516dd',
      'https://images.unsplash.com/photo-1585155770447-2f66e2a397b5',
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90'
    ],
    discount: 20,
    rating: 4.8,
    reviewCount: 32,
    specifications: [
      { name: 'Material', value: 'Eco-Friendly' },
      { name: 'Dimensions', value: '8" x 8" x 4"' },
      { name: 'Weight', value: '1.2 lbs' }
    ],
    variants: [
      {
        name: 'Color',
        options: ['Natural', 'Brown', 'Black']
      },
      {
        name: 'Style',
        options: ['Classic', 'Modern', 'Vintage']
      }
    ]
  },
  {
    id: '4',
    title: 'Premium Product 4',
    price: 69.99,
    originalPrice: 89.99,
    description: 'An innovative product that combines cutting-edge technology with sleek design. Perfect for tech enthusiasts.',
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f',
      'https://images.unsplash.com/photo-1563903530908-afdd155d057a',
      'https://images.unsplash.com/photo-1577803645773-f96470509666',
      'https://images.unsplash.com/photo-1554866585-cd94860890b7'
    ],
    discount: 22,
    rating: 4.3,
    reviewCount: 15,
    specifications: [
      { name: 'Material', value: 'High-Tech Composite' },
      { name: 'Dimensions', value: '6" x 4" x 1"' },
      { name: 'Weight', value: '0.8 lbs' }
    ],
    variants: [
      {
        name: 'Color',
        options: ['Silver', 'Gold', 'Space Gray']
      },
      {
        name: 'Storage',
        options: ['64GB', '128GB', '256GB']
      }
    ]
  }
];

export const ProductPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { theme } = useTheme();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch with a small delay
    const fetchProduct = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 300));
        const foundProduct = mockProducts.find(p => p.id === productId);

        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          // Fallback to a default product if not found
          setProduct(mockProducts[0]);
          console.warn(`Product with ID ${productId} not found, showing default product`);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <a href="/" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <ProductDetails product={product} />
    </div>
  );
};