import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Store } from '../pages/Store/Store';
import { ProductDetails } from '../pages/Store/components/ProductDetails';
import { Collection } from '../pages/Store/components/Collection';

const dummyProduct = {
  id: '1',
  title: 'Premium Product 1',
  price: 99.99,
  originalPrice: 129.99,
  description: 'This is a premium product with high-quality materials and excellent craftsmanship.',
  images: [
    '/images/products/product-1.jpg',
    '/images/products/product-2.jpg',
    '/images/products/product-3.jpg',
  ],
  discount: 20,
  rating: 4.5,
  reviewCount: 24,
  specifications: [
    { name: 'Material', value: 'Premium leather' },
    { name: 'Color', value: 'Black' },
    { name: 'Size', value: 'Medium' }
  ],
  variants: [
    {
      name: 'Size',
      options: ['Small', 'Medium', 'Large']
    },
    {
      name: 'Color',
      options: ['Black', 'Brown', 'Navy']
    }
  ]
};

const dummyProducts = Array.from({ length: 8 }, (_, index) => ({
  id: String(index + 1),
  title: `Premium Product ${index + 1}`,
  price: 99.99 - (index * 5),
  originalPrice: 129.99,
  image: `/images/products/product-${index + 1}.jpg`,
  discount: 20,
  rating: 4 + (Math.random() * 1),
  reviewCount: Math.floor(Math.random() * 50) + 10
}));

export const StoreRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Store />} />
      <Route path="/products/:id" element={<ProductDetails product={dummyProduct} />} />
      <Route path="/collection/:id" element={<Collection title="All Products" products={dummyProducts} />} />
    </Routes>
  );
};