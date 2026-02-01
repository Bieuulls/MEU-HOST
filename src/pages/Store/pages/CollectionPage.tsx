import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Newsletter } from '../components/Newsletter';
import { Collection } from '../components/Collection';

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

interface CollectionData {
  id: string;
  title: string;
  description?: string;
  products: Product[];
  image?: string;
}

export const CollectionPage: React.FC = () => {
  const { collectionId } = useParams<{ collectionId: string }>();
  const [collection, setCollection] = useState<CollectionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollection = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        // For now, we'll simulate a collection fetch with mock data
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

        // Mock collection data
        const mockCollection: CollectionData = {
          id: collectionId || 'default',
          title: collectionId
            ? collectionId.charAt(0).toUpperCase() + collectionId.slice(1)
            : 'Featured Collection',
          description: 'Explore our curated selection of premium products designed for quality and style.',
          image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
          products: [
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
            },
            {
              id: "5",
              title: "Premium Product 5",
              price: 59.99,
              originalPrice: 79.99,
              image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
              discount: 25,
              rating: 4.0,
              reviewCount: 12
            },
            {
              id: "6",
              title: "Premium Product 6",
              price: 49.99,
              originalPrice: 69.99,
              image: "https://images.unsplash.com/photo-1560343090-f0409e92791a",
              discount: 28,
              rating: 4.6,
              reviewCount: 28
            },
            {
              id: "7",
              title: "Premium Product 7",
              price: 39.99,
              originalPrice: 59.99,
              image: "https://images.unsplash.com/photo-1564466809058-bf4114d55352",
              discount: 33,
              rating: 4.1,
              reviewCount: 16
            },
            {
              id: "8",
              title: "Premium Product 8",
              price: 29.99,
              originalPrice: 49.99,
              image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f",
              discount: 40,
              rating: 4.4,
              reviewCount: 22
            }
          ]
        };

        setCollection(mockCollection);
      } catch (err) {
        console.error('Error fetching collection:', err);
        setError('Failed to load collection. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, [collectionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Collection Not Found</h1>
            <p className="text-gray-600">{error || "The collection you're looking for could not be found."}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main>
        {/* Collection Banner */}
        {collection.image && (
          <div className="relative bg-gray-900">
            <div className="absolute inset-0">
              <img
                src={collection.image}
                alt={collection.title}
                className="w-full h-full object-cover opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
            </div>
            <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                {collection.title}
              </h1>
              {collection.description && (
                <p className="mt-6 text-xl text-white max-w-3xl mx-auto">
                  {collection.description}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Collection Products */}
        <div className="container mx-auto px-4 py-12">
          <Collection
            title={collection.title}
            products={collection.products}
            showFilters={true}
          />
        </div>

        <Newsletter />
      </main>

      <Footer />
    </div>
  );
};