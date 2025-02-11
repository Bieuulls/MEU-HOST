import { BarChart2, DollarSign, ShoppingBag, Users } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  trend?: {
    value: string;
    isUp: boolean;
  };
}

function StatCard({ title, value, icon: Icon, trend }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          {trend && (
            <p className={`text-sm mt-1 ${trend.isUp ? 'text-green-500' : 'text-red-500'}`}>
              {trend.isUp ? '↑' : '↓'} {trend.value}
            </p>
          )}
        </div>
        <div className="bg-blue-50 p-3 rounded-full">
          <Icon className="w-6 h-6 text-blue-500" />
        </div>
      </div>
    </div>
  );
}

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Vendas Totais"
          value="R$ 0,00"
          icon={DollarSign}
          trend={{ value: '0% vs. mês anterior', isUp: false }}
        />
        <StatCard
          title="Pedidos"
          value="0"
          icon={ShoppingBag}
          trend={{ value: '0% vs. mês anterior', isUp: false }}
        />
        <StatCard
          title="Clientes"
          value="0"
          icon={Users}
          trend={{ value: '0% vs. mês anterior', isUp: false }}
        />
        <StatCard
          title="Média de Vendas"
          value="R$ 0,00"
          icon={BarChart2}
          trend={{ value: '0% vs. mês anterior', isUp: false }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Últimos Pedidos</h2>
          <div className="flex items-center justify-center h-64 text-gray-400">
            <p>Nenhum pedido realizado</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Produtos Mais Vendidos</h2>
          <div className="flex items-center justify-center h-64 text-gray-400">
            <p>Nenhum produto vendido</p>
          </div>
        </div>
      </div>
    </div>
  );
}
