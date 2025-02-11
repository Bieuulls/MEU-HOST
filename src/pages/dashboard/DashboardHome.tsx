import { BarChart2, Package, ShoppingCart, Users } from 'lucide-react';

const stats = [
  { name: 'Vendas Hoje', value: 'R$ 12.450', icon: ShoppingCart },
  { name: 'Produtos Ativos', value: '245', icon: Package },
  { name: 'Clientes Novos', value: '32', icon: Users },
  { name: 'Taxa de Conversão', value: '3.2%', icon: BarChart2 },
];

export function DashboardHome() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      
      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:py-6"
          >
            <dt>
              <div className="absolute rounded-md bg-blue-500 p-3">
                <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                {stat.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            </dd>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Atividade Recente</h2>
        <div className="mt-4 bg-white shadow rounded-lg p-6">
          <p className="text-gray-500">Nenhuma atividade recente</p>
        </div>
      </div>
    </div>
  );
}