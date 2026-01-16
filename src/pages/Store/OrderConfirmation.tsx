import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export function OrderConfirmation() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">
          Pedido Confirmado!
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Obrigado por sua compra. Você receberá um email com os detalhes do pedido.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/loja"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Continuar Comprando
          </Link>
          <Link
            to="/minha-conta/pedidos"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Ver Meus Pedidos
          </Link>
        </div>
      </div>
    </div>
  );
}