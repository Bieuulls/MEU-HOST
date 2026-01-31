import { Route, Routes } from 'react-router-dom';
import { Store } from '../pages/Store/Store';
import { ProductList } from '../pages/Store/ProductList';
import { ProductDetails } from '../pages/Store/ProductDetails';
import { Cart } from '../pages/Store/Cart';
import { Checkout } from '../pages/Store/Checkout';
import { OrderConfirmation } from '../pages/Store/OrderConfirmation';

export function StoreRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Store />} />
      <Route path="/products" element={<ProductList />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/order-confirmation" element={<OrderConfirmation />} />
    </Routes>
  );
}
