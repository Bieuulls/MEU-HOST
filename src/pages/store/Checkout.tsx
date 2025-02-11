import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import type { Address } from '../../types/database';
import { ImageWithFallback } from '../../components/common/ImageWithFallback';

interface CheckoutForm {
  shipping_address: Address;
  billing_address: Address;
  same_billing_address: boolean;
  payment_method: string;
}

const initialAddress: Address = {
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
  zipcode: '',
  country: 'Brasil'
};

const initialForm: CheckoutForm = {
  shipping_address: initialAddress,
  billing_address: initialAddress,
  same_billing_address: true,
  payment_method: 'credit_card'
};

export function Checkout() {
  const navigate = useNavigate();
  const { state: cart, clearCart } = useCart();
  const { user } = useAuth();
  const [form, setForm] = useState<CheckoutForm>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (cart.items.length === 0) {
    navigate('/loja/carrinho');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('Você precisa estar logado para finalizar a compra');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const order = {
        user_id: user.id,
        status: 'pending',
        total: cart.total,
        items: cart.items.map(item => ({
          product_id: item.product.id,
          variation_id: item.variation?.id,
          quantity: item.quantity,
          price: item.variation?.price ?? item.product.price
        })),
        shipping_address: form.shipping_address,
        billing_address: form.same_billing_address ? form.shipping_address : form.billing_address,
        payment_method: form.payment_method
      };

      const { error: orderError } = await supabase
        .from('orders')
        .insert([order]);

      if (orderError) throw orderError;

      clearCart();
      navigate('/loja/pedido-confirmado');
    } catch (err) {
      console.error('Error creating order:', err);
      setError('Erro ao processar pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Endereço de Entrega
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Rua
              </label>
              <input
                type="text"
                required
                value={form.shipping_address.street}
                onChange={e => setForm({
                  ...form,
                  shipping_address: {
                    ...form.shipping_address,
                    street: e.target.value
                  }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Número
                </label>
                <input
                  type="text"
                  required
                  value={form.shipping_address.number}
                  onChange={e => setForm({
                    ...form,
                    shipping_address: {
                      ...form.shipping_address,
                      number: e.target.value
                    }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Complemento
                </label>
                <input
                  type="text"
                  value={form.shipping_address.complement || ''}
                  onChange={e => setForm({
                    ...form,
                    shipping_address: {
                      ...form.shipping_address,
                      complement: e.target.value
                    }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bairro
              </label>
              <input
                type="text"
                required
                value={form.shipping_address.neighborhood}
                onChange={e => setForm({
                  ...form,
                  shipping_address: {
                    ...form.shipping_address,
                    neighborhood: e.target.value
                  }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Cidade
                </label>
                <input
                  type="text"
                  required
                  value={form.shipping_address.city}
                  onChange={e => setForm({
                    ...form,
                    shipping_address: {
                      ...form.shipping_address,
                      city: e.target.value
                    }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Estado
                </label>
                <input
                  type="text"
                  required
                  value={form.shipping_address.state}
                  onChange={e => setForm({
                    ...form,
                    shipping_address: {
                      ...form.shipping_address,
                      state: e.target.value
                    }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                CEP
              </label>
              <input
                type="text"
                required
                value={form.shipping_address.zipcode}
                onChange={e => setForm({
                  ...form,
                  shipping_address: {
                    ...form.shipping_address,
                    zipcode: e.target.value
                  }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={form.same_billing_address}
                onChange={e => setForm({
                  ...form,
                  same_billing_address: e.target.checked
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-600">
                Usar mesmo endereço para cobrança
              </span>
            </label>
          </div>

          {!form.same_billing_address && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Endereço de Cobrança
              </h2>
              {/* Repetir os campos de endereço para cobrança */}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Resumo do Pedido
          </h2>
          <div className="bg-white shadow-sm rounded-lg p-6">
            <div className="flow-root">
              <ul className="-my-4 divide-y divide-gray-200">
                {cart.items.map((item) => (
                  <li key={`${item.product.id}-${item.variation?.id}`} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <ImageWithFallback
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="h-10 w-10 object-cover rounded-md"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {item.product.name}
                        </p>
                        {item.variation && (
                          <p className="mt-1 text-sm text-gray-500">
                            Variação: {item.variation.name}
                          </p>
                        )}
                        <p className="mt-1 text-sm text-gray-500">
                          Quantidade: {item.quantity}
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-sm font-medium text-gray-900">
                        R$ {((item.variation?.price ?? item.product.price) * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Subtotal</p>
                <p className="text-sm font-medium text-gray-900">
                  R$ {cart.total.toFixed(2)}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Frete</p>
                <p className="text-sm font-medium text-gray-900">Grátis</p>
              </div>
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <p className="text-base font-medium text-gray-900">Total</p>
                  <p className="text-base font-medium text-gray-900">
                    R$ {cart.total.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Forma de Pagamento
              </h3>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="payment_method"
                    value="credit_card"
                    checked={form.payment_method === 'credit_card'}
                    onChange={e => setForm({
                      ...form,
                      payment_method: e.target.value
                    })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    Cartão de Crédito
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="payment_method"
                    value="pix"
                    checked={form.payment_method === 'pix'}
                    onChange={e => setForm({
                      ...form,
                      payment_method: e.target.value
                    })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    PIX
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="payment_method"
                    value="boleto"
                    checked={form.payment_method === 'boleto'}
                    onChange={e => setForm({
                      ...form,
                      payment_method: e.target.value
                    })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    Boleto Bancário
                  </span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-8 w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Processando...' : 'Finalizar Compra'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}