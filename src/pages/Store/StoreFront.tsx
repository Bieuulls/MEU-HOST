import React from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FeaturedProducts } from './components/FeaturedProducts';
import { Collection } from './components/Collection';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';

export const StoreFront: React.FC = () => {
  // Mock featured products data
  const featuredProducts = [
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
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Products</h2>
          <Collection
            title="Featured Products"
            products={featuredProducts}
            showFilters={false}
          />
        </div>
      </section>

      <Newsletter />
      <Footer />
    </div>
  );
};