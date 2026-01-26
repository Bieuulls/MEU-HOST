import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { CartProvider } from '../../contexts/CartContext';
import { StoreRoutes } from './routes';

export const Store: React.FC = () => {
  return (
    <ThemeProvider>
      <CartProvider>
        <Router>
          <StoreRoutes />
        </Router>
      </CartProvider>
    </ThemeProvider>
  );
};