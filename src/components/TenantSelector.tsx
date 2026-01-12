import React from 'react';
import { useTenant } from '../contexts/TenantContext';
import { Store } from 'lucide-react';

export const TenantSelector: React.FC = () => {
  const { currentTenant, userTenants, setCurrentTenant, loading } = useTenant();

  if (loading) {
    return (
      <div className="flex items-center space-x-2 px-4 py-2 text-gray-400">
        <Store className="w-5 h-5" />
        <span>Loading stores...</span>
      </div>
    );
  }

  if (userTenants.length === 0) {
    return (
      <div className="flex items-center space-x-2 px-4 py-2 text-gray-400">
        <Store className="w-5 h-5" />
        <span>No stores available</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <select
        value={currentTenant?.id || ''}
        onChange={(e) => {
          const tenant = userTenants.find(t => t.id === e.target.value);
          if (tenant) {
            setCurrentTenant(tenant);
          }
        }}
        className="appearance-none bg-[#303030] text-white pl-10 pr-8 py-2 rounded-md border border-gray-700 focus:outline-none focus:border-gray-500"
      >
        <option value="" disabled>Select a store</option>
        {userTenants.map((tenant) => (
          <option key={tenant.id} value={tenant.id}>
            {tenant.name}
          </option>
        ))}
      </select>
      <Store className="absolute left-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
    </div>
  );
};
