import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { StoreFront } from './StoreFront';
import { ProductPage } from './pages/ProductPage';
import { CollectionPage } from './pages/CollectionPage';
import { Catalog } from './pages/Catalog';
import { Contact } from './pages/Contact';
import { NotFoundPage } from './pages/NotFoundPage';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { AccountPage } from './pages/AccountPage';
import { SearchResults } from './pages/SearchResults';

export const StoreRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<StoreFront />} />
      <Route path="/products/:productId" element={<ProductPage />} />
      <Route path="/collections/:collectionId" element={<CollectionPage />} />
      <Route path="/catalog" element={<Catalog />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/account" element={<AccountPage />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};