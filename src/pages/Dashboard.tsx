import React from 'react';
import { BarChart2, DollarSign, ShoppingBag, Users } from 'lucide-react';

const stats = [
  { name: 'Total Sales', value: '$45,231', icon: DollarSign, change: '+20.1%' },
  { name: 'Active Orders', value: '356', icon: ShoppingBag, change: '+8.2%' },
  { name: 'New Customers', value: '2,103', icon: Users, change: '+12.5%' },
  { name: 'Revenue Growth', value: '+12.5%', icon: BarChart2, change: '+4.9%' },
];

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <div className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-gray-500">{stat.name}</div>
                <Icon className="w-5 h-5 text-gray-400" />
              </div>
              <div className="mt-2 flex items-baseline">
                <div className="text-2xl font-semibold">{stat.value}</div>
                <span className="ml-2 text-sm font-medium text-green-600">{stat.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          {/* Add recent activity content */}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Performance Overview</h2>
          {/* Add performance charts */}
        </div>
      </div>
    </div>
  );
};
