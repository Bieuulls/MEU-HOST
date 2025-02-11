import { ShoppingCart } from 'lucide-react';

export function Orders() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Pedidos</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center h-64 text-gray-400">
          <div className="text-center">
            <ShoppingCart className="w-12 h-12 mx-auto mb-4" />
            <p>Nenhum pedido realizado</p>
          </div>
        </div>
      </div>
    </div>
  );
}
