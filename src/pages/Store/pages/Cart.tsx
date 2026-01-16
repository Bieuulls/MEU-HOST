import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Minus, Plus, X, ShoppingBag } from 'lucide-react';

interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  variant?: Record<string, string>;
}

export const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch cart items from context or API
    // For now, we'll use mock data
    const mockCartItems: CartItem[] = [
      {
        id: '1',
        title: 'Premium Leather Wallet',
        price: 99.99,
        image: 'https://images.unsplash.com/photo-1627123424574-724758594e93',
        quantity: 1,
        variant: { Color: 'Brown', Size: 'Standard' }
      },
      {
        id: '3',
        title: 'Premium Product 3',
        price: 79.99,
        image: 'https://images.unsplash.com/photo-1581539250439-c96689b516dd',
        quantity: 2
      }
    ];

    setCartItems(mockCartItems);
    setLoading(false);
  }, []);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 10.00; // Fixed shipping cost for demo
  const tax = subtotal * 0.08; // 8% tax for demo
  const total = subtotal + shipping + tax;

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>

          {cartItems.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <ShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-2xl font-medium text-gray-900 mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-8">Looks like you haven't added any products to your cart yet.</p>
              <Link to="/" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-6 border-b">
                    <h2 className="text-lg font-medium text-gray-900">Cart Items ({cartItems.length})</h2>
                  </div>

                  <ul className="divide-y divide-gray-200">
                    {cartItems.map((item) => (
                      <li key={item.id} className="p-6">
                        <div className="flex flex-col sm:flex-row">
                          {/* Product Image */}
                          <div className="flex-shrink-0 sm:w-24 sm:h-24 w-full h-40 mb-4 sm:mb-0">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover rounded-md"
                              onError={(e) => {
                                e.currentTarget.src = `https://via.placeholder.com/96x96/e2e8f0/64748b?text=Product`;
                              }}
                            />
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 sm:ml-6">
                            <div className="flex justify-between">
                              <div>
                                <h3 className="text-base font-medium text-gray-900">
                                  <Link to={`/products/${item.id}`} className="hover:text-blue-600">
                                    {item.title}
                                  </Link>
                                </h3>

                                {/* Variants */}
                                {item.variant && Object.entries(item.variant).length > 0 && (
                                  <div className="mt-1 text-sm text-gray-500">
                                    {Object.entries(item.variant).map(([key, value], index, array) => (
                                      <span key={key}>
                                        {key}: {value}
                                        {index < array.length - 1 ? ', ' : ''}
                                      </span>
                                    ))}
                                  </div>
                                )}

                                {/* Price */}
                                <p className="mt-1 text-sm font-medium text-gray-900">
                                  ${item.price.toFixed(2)}
                                </p>
                              </div>

                              <div className="flex flex-col items-end">
                                {/* Remove Button */}
                                <button
                                  onClick={() => removeItem(item.id)}
                                  className="text-sm text-gray-500 hover:text-red-600"
                                >
                                  Remove
                                </button>

                                {/* Quantity Controls */}
                                <div className="flex items-center mt-4 border rounded-md">
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="p-2 hover:bg-gray-100"
                                    disabled={item.quantity <= 1}
                                  >
                                    <Minus className="w-4 h-4 text-gray-500" />
                                  </button>
                                  <span className="w-10 text-center">{item.quantity}</span>
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="p-2 hover:bg-gray-100"
                                  >
                                    <Plus className="w-4 h-4 text-gray-500" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                  <h2 className="text-lg font-medium text-gray-900 mb-6">Order Summary</h2>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900 font-medium">${subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-gray-900 font-medium">${shipping.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span className="text-gray-900 font-medium">${tax.toFixed(2)}</span>
                    </div>

                    <div className="border-t pt-4 mt-4">
                      <div className="flex justify-between">
                        <span className="text-lg font-medium text-gray-900">Total</span>
                        <span className="text-lg font-bold text-gray-900">${total.toFixed(2)}</span>
                      </div>
                    </div>

                    <Link
                      to="/checkout"
                      className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center block mt-6"
                    >
                      Proceed to Checkout
                    </Link>

                    <Link
                      to="/"
                      className="w-full text-blue-600 py-3 rounded-lg font-medium hover:text-blue-700 transition-colors text-center block mt-2"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};