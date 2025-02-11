import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Package, 
  Users, 
  FileText, 
  BarChart2, 
  Mail, 
  ShoppingBag, 
  Tag, 
  ShoppingCart,
  ChevronDown,
  Settings,
  Store,
  Menu,
  ChevronLeft
} from 'lucide-react';

interface MenuItem {
  label: string;
  path: string;
  icon: React.ElementType;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    label: 'Dashboard',
    path: '/',
    icon: Home
  },
  {
    label: 'Produtos',
    path: '/products',
    icon: Package,
    children: [
      {
        label: 'Lista de Produtos',
        path: '/products',
        icon: Package
      },
      {
        label: 'Segmentos',
        path: '/products/segments',
        icon: Tag
      }
    ]
  },
  {
    label: 'Pedidos',
    path: '/orders',
    icon: ShoppingCart
  },
  {
    label: 'Clientes',
    path: '/customers',
    icon: Users
  },
  {
    label: 'Marketing',
    path: '/marketing',
    icon: Mail,
    children: [
      {
        label: 'Campanhas',
        path: '/marketing/campaigns',
        icon: Mail
      },
      {
        label: 'Automações',
        path: '/marketing/automations',
        icon: Settings
      }
    ]
  },
  {
    label: 'Analytics',
    path: '/analytics',
    icon: BarChart2
  },
  {
    label: 'Conteúdo',
    path: '/content',
    icon: FileText
  },
  {
    label: 'Canais de Venda',
    path: '/sales-channels',
    icon: ShoppingBag,
    children: [
      {
        label: 'Loja Online',
        path: '/store',
        icon: Store
      },
      {
        label: 'Marketplaces',
        path: '/sales-channels/marketplaces',
        icon: ShoppingBag
      }
    ]
  }
];

export function Sidebar() {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleItem = (label: string) => {
    setExpandedItems(prev =>
      prev.includes(label)
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const toggleSidebar = () => {
    setIsCollapsed(prev => !prev);
    // Quando colapsar, fechar todos os menus expandidos
    if (!isCollapsed) {
      setExpandedItems([]);
    }
  };

  const renderMenuItem = (item: MenuItem) => {
    const isExpanded = expandedItems.includes(item.label);
    const hasChildren = item.children && item.children.length > 0;
    const Icon = item.icon;

    return (
      <div key={item.path} className="w-full">
        {hasChildren ? (
          <div>
            <button
              onClick={() => toggleItem(item.label)}
              className="flex items-center w-full px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            >
              <Icon className="w-5 h-5 mr-3 text-gray-400" />
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      isExpanded ? 'transform rotate-180' : ''
                    }`}
                  />
                </>
              )}
            </button>
            {isExpanded && !isCollapsed && item.children && (
              <div className="ml-4 mt-1 space-y-1">
                {item.children.map((child) => (
                  <NavLink
                    key={child.path}
                    to={child.path}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-2 text-sm ${
                        isActive
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-600 hover:bg-gray-100'
                      } rounded-md transition-colors`
                    }
                  >
                    {child.icon && <child.icon className="w-4 h-4 mr-3" />}
                    {child.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ) : (
          <NavLink
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-2 ${
                isActive
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:bg-gray-100'
              } rounded-md transition-colors group`
            }
            title={isCollapsed ? item.label : ''}
          >
            <Icon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'} text-gray-400 group-hover:text-gray-600`} />
            {!isCollapsed && item.label}
          </NavLink>
        )}
      </div>
    );
  };

  return (
    <aside 
      className={`${
        isCollapsed ? 'w-16' : 'w-64'
      } bg-white border-r border-gray-200 min-h-screen transition-all duration-300 ease-in-out relative`}
    >
      <div className="p-4">
        <div className="mb-8 flex items-center justify-between">
          {!isCollapsed && <h1 className="text-xl font-bold text-gray-800">Admin</h1>}
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            title={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
          >
            {isCollapsed ? (
              <Menu className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>
        <nav className="space-y-1">
          {menuItems.map(renderMenuItem)}
        </nav>
      </div>
    </aside>
  );
}