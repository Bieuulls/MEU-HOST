import { Route, Routes } from 'react-router-dom';
import { Store } from '../pages/store/Store';
import { ProductList } from '../pages/store/ProductList';
import { ProductDetails } from '../pages/store/ProductDetails';
import { Cart } from '../pages/store/Cart';
import { Checkout } from '../pages/store/Checkout';
import { OrderConfirmation } from '../pages/store/OrderConfirmation';

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
