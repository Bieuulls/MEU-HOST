import { Package } from 'lucide-react';

export function Products() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Produtos</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Novo Produto
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center h-64 text-gray-400">
          <div className="text-center">
            <Package className="w-12 h-12 mx-auto mb-4" />
            <p>Nenhum produto cadastrado</p>
          </div>
        </div>
      </div>
    </div>
  );
}
