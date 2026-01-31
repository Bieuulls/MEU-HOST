import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../contexts/CartContext';
import { AlertCircle, Check } from 'lucide-react';

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentInfo {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

interface FormErrors {
  shipping?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  payment?: {
    cardNumber?: string;
    cardHolder?: string;
    expiryDate?: string;
    cvv?: string;
  };
}

export const CheckoutForm: React.FC = () => {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate(); // Adicionando o hook useNavigate
  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping');

  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const shipping = 10; // Fixed shipping cost
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shipping + tax;

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateZipCode = (zipCode: string): boolean => {
    const zipRegex = /^\d{5}(-\d{4})?$/;
    return zipRegex.test(zipCode);
  };

  const formatCardNumber = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    const groups = numbers.match(/.{1,4}/g);
    return groups ? groups.join(' ').substr(0, 19) : '';
  };

  const formatExpiryDate = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length >= 3) {
      return `${numbers.substr(0, 2)}/${numbers.substr(2, 2)}`;
    }
    return numbers;
  };

  const validateShippingForm = (): boolean => {
    const errors: FormErrors = { shipping: {} };
    let isValid = true;

    if (!shippingInfo.firstName.trim()) {
      errors.shipping!.firstName = 'First name is required';
      isValid = false;
    }

    if (!shippingInfo.lastName.trim()) {
      errors.shipping!.lastName = 'Last name is required';
      isValid = false;
    }

    if (!shippingInfo.email.trim()) {
      errors.shipping!.email = 'Email is required';
      isValid = false;
    } else if (!validateEmail(shippingInfo.email)) {
      errors.shipping!.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!shippingInfo.address.trim()) {
      errors.shipping!.address = 'Address is required';
      isValid = false;
    }

    if (!shippingInfo.city.trim()) {
      errors.shipping!.city = 'City is required';
      isValid = false;
    }

    if (!shippingInfo.state.trim()) {
      errors.shipping!.state = 'State is required';
      isValid = false;
    }

    if (!shippingInfo.zipCode.trim()) {
      errors.shipping!.zipCode = 'ZIP code is required';
      isValid = false;
    } else if (!validateZipCode(shippingInfo.zipCode)) {
      errors.shipping!.zipCode = 'Please enter a valid ZIP code';
      isValid = false;
    }

    if (!shippingInfo.country) {
      errors.shipping!.country = 'Please select a country';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const validatePaymentForm = (): boolean => {
    const errors: FormErrors = { payment: {} };
    let isValid = true;

    if (!paymentInfo.cardNumber.trim() || paymentInfo.cardNumber.replace(/\D/g, '').length !== 16) {
      errors.payment!.cardNumber = 'Please enter a valid 16-digit card number';
      isValid = false;
    }

    if (!paymentInfo.cardHolder.trim()) {
      errors.payment!.cardHolder = 'Card holder name is required';
      isValid = false;
    }

    if (!paymentInfo.expiryDate || paymentInfo.expiryDate.length !== 5) {
      errors.payment!.expiryDate = 'Please enter a valid expiry date (MM/YY)';
      isValid = false;
    } else {
      const [month, year] = paymentInfo.expiryDate.split('/');
      if (!month || !year || month.length !== 2 || year.length !== 2) {
        errors.payment!.expiryDate = 'Please enter a valid expiry date (MM/YY)';
        isValid = false;
      } else {
        const monthNum = parseInt(month);
        const yearNum = parseInt(year);
        const now = new Date();
        const currentYear = now.getFullYear() % 100;
        const currentMonth = now.getMonth() + 1;

        if (monthNum < 1 || monthNum > 12) {
          errors.payment!.expiryDate = 'Invalid month';
          isValid = false;
        } else if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
          errors.payment!.expiryDate = 'Card has expired';
          isValid = false;
        }
      }
    }

    if (!paymentInfo.cvv.trim() || !/^\d{3,4}$/.test(paymentInfo.cvv)) {
      errors.payment!.cvv = 'Please enter a valid CVV';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateShippingForm()) {
      setStep('payment');
      window.scrollTo(0, 0);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePaymentForm()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Here you would integrate with your payment processor
      // For now, we'll simulate a successful payment
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Process the order
      const order = {
        items,
        shippingInfo,
        paymentInfo: {
          ...paymentInfo,
          cardNumber: `**** **** **** ${paymentInfo.cardNumber.slice(-4)}`, // Mask card number for security
          cvv: '***' // Mask CVV for security
        },
        subtotal,
        shipping,
        tax,
        total,
        orderDate: new Date().toISOString(),
        orderNumber: `ORD-${Math.floor(Math.random() * 1000000)}`
      };

      console.log('Order processed:', order);

      // In a real app, you would send this to your backend
      // await api.post('/orders', order);

      setStep('confirmation');
      clearCart();
    } catch (err) {
      setError('Failed to process payment. Please try again.');
      console.error('Payment error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setPaymentInfo(prev => ({ ...prev, cardNumber: formatted }));
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    setPaymentInfo(prev => ({ ...prev, expiryDate: formatted }));
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cvv = e.target.value.replace(/\D/g, '').substr(0, 4);
    setPaymentInfo(prev => ({ ...prev, cvv }));
  };

  const handleBackToStore = () => {
    navigate('/store');
  };

  // Format currency values consistently
  const formatCurrency = (value: number): string => {
    return value.toFixed(2);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'shipping' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>1</div>
          <div className="mx-2 text-sm">Shipping</div>
        </div>
        <div className="w-16 h-1 bg-gray-200 mx-2" />
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'payment' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>2</div>
          <div className="mx-2 text-sm">Payment</div>
        </div>
        <div className="w-16 h-1 bg-gray-200 mx-2" />
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'confirmation' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>3</div>
          <div className="mx-2 text-sm">Confirmation</div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {step === 'shipping' && (
            <form onSubmit={handleShippingSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    required
                    value={shippingInfo.firstName}
                    onChange={e => setShippingInfo({ ...shippingInfo, firstName: e.target.value })}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${formErrors.shipping?.firstName ? 'border-red-300' : 'border-gray-300'}`}
                  />
                  {formErrors.shipping?.firstName && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.shipping.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    required
                    value={shippingInfo.lastName}
                    onChange={e => setShippingInfo({ ...shippingInfo, lastName: e.target.value })}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${formErrors.shipping?.lastName ? 'border-red-300' : 'border-gray-300'}`}
                  />
                  {formErrors.shipping?.lastName && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.shipping.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  required
                  value={shippingInfo.email}
                  onChange={e => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${formErrors.shipping?.email ? 'border-red-300' : 'border-gray-300'}`}
                />
                {formErrors.shipping?.email && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.shipping.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  required
                  value={shippingInfo.address}
                  onChange={e => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${formErrors.shipping?.address ? 'border-red-300' : 'border-gray-300'}`}
                />
                {formErrors.shipping?.address && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.shipping.address}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    required
                    value={shippingInfo.city}
                    onChange={e => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${formErrors.shipping?.city ? 'border-red-300' : 'border-gray-300'}`}
                  />
                  {formErrors.shipping?.city && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.shipping.city}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">State</label>
                  <input
                    type="text"
                    required
                    value={shippingInfo.state}
                    onChange={e => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${formErrors.shipping?.state ? 'border-red-300' : 'border-gray-300'}`}
                  />
                  {formErrors.shipping?.state && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.shipping.state}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
                  <input
                    type="text"
                    required
                    value={shippingInfo.zipCode}
                    onChange={e => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${formErrors.shipping?.zipCode ? 'border-red-300' : 'border-gray-300'}`}
                  />
                  {formErrors.shipping?.zipCode && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.shipping.zipCode}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Country</label>
                  <select
                    required
                    value={shippingInfo.country}
                    onChange={e => setShippingInfo({ ...shippingInfo, country: e.target.value })}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${formErrors.shipping?.country ? 'border-red-300' : 'border-gray-300'}`}
                  >
                    <option value="">Select a country</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="BR">Brazil</option>
                    <option value="MX">Mexico</option>
                    <option value="UK">United Kingdom</option>
                    <option value="FR">France</option>
                    <option value="DE">Germany</option>
                    <option value="JP">Japan</option>
                    <option value="AU">Australia</option>
                  </select>
                  {formErrors.shipping?.country && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.shipping.country}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Continue to Payment
                </button>
              </div>
            </form>
          )}

          {step === 'payment' && (
            <form onSubmit={handlePaymentSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Information</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700">Card Number</label>
                <input
                  type="text"
                  required
                  value={paymentInfo.cardNumber}
                  onChange={handleCardNumberChange}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${formErrors.payment?.cardNumber ? 'border-red-300' : 'border-gray-300'}`}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
                {formErrors.payment?.cardNumber && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.payment.cardNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Card Holder</label>
                <input
                  type="text"
                  required
                  value={paymentInfo.cardHolder}
                  onChange={e => setPaymentInfo({ ...paymentInfo, cardHolder: e.target.value })}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${formErrors.payment?.cardHolder ? 'border-red-300' : 'border-gray-300'}`}
                />
                {formErrors.payment?.cardHolder && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.payment.cardHolder}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                  <input
                    type="text"
                    required
                    value={paymentInfo.expiryDate}
                    onChange={handleExpiryDateChange}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${formErrors.payment?.expiryDate ? 'border-red-300' : 'border-gray-300'}`}
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                  {formErrors.payment?.expiryDate && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.payment.expiryDate}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">CVV</label>
                  <input
                    type="text"
                    required
                    value={paymentInfo.cvv}
                    onChange={handleCvvChange}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${formErrors.payment?.cvv ? 'border-red-300' : 'border-gray-300'}`}
                    placeholder="123"
                    maxLength={4}
                  />
                  {formErrors.payment?.cvv && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.payment.cvv}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep('shipping')}
                  className="px-6 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {isSubmitting ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </form>
          )}

          {step === 'confirmation' && (
            <div className="text-center py-8 bg-white p-6 rounded-lg shadow-sm">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="mt-4 text-lg font-medium text-gray-900">Order Confirmed!</h2>
              <p className="mt-2 text-sm text-gray-500">
                Thank you for your order. We'll send you a confirmation email shortly.
              </p>
              <div className="mt-4 text-sm text-gray-600">
                <p>Your order number: <span className="font-medium">{`ORD-${Math.floor(Math.random() * 1000000)}`}</span></p>
                <p>Order date: <span className="font-medium">{new Date().toLocaleDateString()}</span></p>
              </div>
              <button
                onClick={handleBackToStore}
                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Back to Store
              </button>
            </div>
          )}
        </div>

        <div className="bg-gray-50 rounded-lg p-6 h-fit sticky top-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
          {items.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item: CartItem) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{item.title}</h4>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">${formatCurrency(item.price * item.quantity)}</p>
                </div>
              ))}

              <div className="border-t border-gray-200 mt-4 pt-4">
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-500">Subtotal</span>
                  <span className="text-sm font-medium text-gray-900">${formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-500">Shipping</span>
                  <span className="text-sm font-medium text-gray-900">${formatCurrency(shipping)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-500">Tax</span>
                  <span className="text-sm font-medium text-gray-900">${formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between py-2 border-t border-gray-200 mt-2 pt-2">
                  <span className="text-base font-medium text-gray-900">Total</span>
                  <span className="text-base font-medium text-gray-900">${formatCurrency(total)}</span>
                </div>
              </div>

              {step !== 'confirmation' && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-medium">🔒</span>
                    </div>
                    <p className="text-sm text-gray-600">Secure payment processing</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Your payment information is encrypted and securely processed. We do not store your full card details.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};