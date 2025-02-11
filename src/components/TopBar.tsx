import { Bell, Search, Settings, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function TopBar() {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <img
              className="h-8 w-auto"
              src="/logo.png"
              alt="Logo"
            />
          </div>

          {/* Search */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="search"
                placeholder="Buscar..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <span className="sr-only">Ver notificações</span>
              <Bell className="h-6 w-6" />
            </button>

            {/* Settings */}
            <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <span className="sr-only">Configurações</span>
              <Settings className="h-6 w-6" />
            </button>

            {/* Profile dropdown */}
            <div className="relative">
              <button className="flex items-center space-x-3 focus:outline-none">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                {user && (
                  <div className="hidden md:flex md:items-center">
                    <span className="text-sm font-medium text-gray-700">
                      {user.email}
                    </span>
                  </div>
                )}
              </button>
            </div>

            {/* Logout */}
            <button
              onClick={signOut}
              className="text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}