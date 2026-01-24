import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  ShoppingCart,
  Package,
  Users,
  FileText,
  BarChart2,
  Megaphone,
  Settings,
  Store,
  Plus,
  Percent,
  Monitor
} from 'lucide-react';

const mainNavItems = [
  { to: '/dashboard', icon: Home, label: 'Home' },
  { to: '/dashboard/orders', icon: ShoppingCart, label: 'Orders' },
  { to: '/dashboard/products', icon: Package, label: 'Products' },
  { to: '/dashboard/customers', icon: Users, label: 'Customers' },
  { to: '/dashboard/content', icon: FileText, label: 'Content' },
  { to: '/dashboard/analytics', icon: BarChart2, label: 'Analytics' },
  { to: '/dashboard/marketing', icon: Megaphone, label: 'Marketing' },
  { to: '/dashboard/discounts', icon: Percent, label: 'Discounts' },
];

const salesChannels = [
  { to: '/dashboard/online-store', icon: Store, label: 'Online Store' },
  { to: '/dashboard/pos', icon: Monitor, label: 'Point of Sale' },
];

const apps = [
  { to: '/dashboard/apps', icon: Plus, label: 'Add apps' },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-[#1a1a1a] text-white min-h-screen">
      <nav className="p-4 space-y-6">
        {/* Main Navigation */}
        <div className="space-y-1">
          {mainNavItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5 mr-3" />
              {label}
            </NavLink>
          ))}
        </div>

        {/* Sales Channels */}
        <div>
          <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase">
            Sales channels
          </div>
          <div className="mt-2 space-y-1">
            {salesChannels.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <Icon className="w-5 h-5 mr-3" />
                {label}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Apps */}
        <div>
          <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase">
            Apps
          </div>
          <div className="mt-2 space-y-1">
            {apps.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <Icon className="w-5 h-5 mr-3" />
                {label}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="pt-4">
          <NavLink
            to="/dashboard/settings"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </NavLink>
        </div>
      </nav>
    </aside>
  );
};
