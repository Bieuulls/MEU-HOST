import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const routeLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  products: 'Produtos',
  orders: 'Pedidos',
  customers: 'Clientes',
  marketing: 'Marketing',
  analytics: 'Analytics',
  content: 'Conteúdo',
  'sales-channels': 'Canais de Venda',
  segments: 'Segmentos',
  campaigns: 'Campanhas',
  automations: 'Automações',
  marketplaces: 'Marketplaces'
};

export function Breadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav className="flex mb-4" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <Link
            to="/"
            className="text-gray-400 hover:text-gray-500 flex items-center"
          >
            <Home className="h-4 w-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const label = routeLabels[value] || value;

          return (
            <li key={to} className="flex items-center">
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <Link
                to={to}
                className={`ml-2 text-sm font-medium ${
                  last
                    ? 'text-gray-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                aria-current={last ? 'page' : undefined}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
