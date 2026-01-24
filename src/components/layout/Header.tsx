import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Search, Bell, User } from 'lucide-react';
import { TenantSelector } from '../TenantSelector';

export const Header: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-[#1a1a1a] border-b border-gray-700">
      <div className="h-16 px-4 flex items-center justify-between">
        <div className="flex items-center flex-1">
          {/* Tenant Selector */}
          <TenantSelector />

          {/* Search */}
          <div className="ml-4 flex-1 max-w-2xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="w-full bg-[#303030] text-white pl-10 pr-4 py-2 rounded-md border border-gray-700 focus:outline-none focus:border-gray-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs text-gray-400 bg-[#404040] rounded">
                  ⌘K
                </kbd>
              </div>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-400 hover:text-white rounded-md">
            <Bell className="w-5 h-5" />
          </button>

          <div className="flex items-center">
            <button className="flex items-center space-x-2 p-2 text-gray-400 hover:text-white rounded-md">
              <div className="w-8 h-8 bg-gray-700 rounded-md flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <span className="text-sm text-gray-300">{user?.name || 'My Store'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
