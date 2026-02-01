import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  FileText,
  ShoppingCart,
  Package,
  Users,
  FileImage,
  BarChart2,
  Megaphone,
  Tag,
  Store,
  Folder,
  FileBox,
  Menu as MenuIcon,
  BookOpen,
  Box,
  ArrowLeftRight,
  Gift,
  Layers,
  Files,
  BarChart,
  Eye,
  Mail,
  Zap,
  Layout,
  Globe,
  Settings,
  ChevronRight,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

const navigation = [
  { name: 'Início', to: '/dashboard/inicio', icon: Home },
  { name: 'Rascunhos', to: '/dashboard/rascunhos', icon: FileText },
  { name: 'Checkouts Abandonados', to: '/dashboard/checkouts', icon: ShoppingCart },
  {
    name: 'Pedidos',
    to: '/dashboard/pedidos',
    icon: Package,
    children: [
      { name: 'Coleções', to: '/dashboard/pedidos/colecoes', icon: Folder },
      { name: 'Estoque', to: '/dashboard/pedidos/estoque', icon: Box },
      { name: 'Pedidos de Compra', to: '/dashboard/pedidos/pedidos-de-compra', icon: FileBox },
      { name: 'Transferências', to: '/dashboard/pedidos/transferencias', icon: ArrowLeftRight },
      { name: 'Cartões-Presente', to: '/dashboard/pedidos/cartoes-presente', icon: Gift },
    ],
  },
  {
    name: 'Produtos',
    to: '/dashboard/produtos',
    icon: Package,
    children: [
      { name: 'Segmentos', to: '/dashboard/produtos/segmentos', icon: Layers },
    ],
  },
  {
    name: 'Clientes',
    to: '/dashboard/clientes',
    icon: Users,
    children: [
      { name: 'Arquivos', to: '/dashboard/clientes/arquivos', icon: Files },
      { name: 'Menus', to: '/dashboard/clientes/menus', icon: MenuIcon },
      { name: 'Posts do Blog', to: '/dashboard/clientes/blog', icon: BookOpen },
    ],
  },
  {
    name: 'Conteúdo',
    to: '/dashboard/conteudo',
    icon: FileImage,
    children: [
      { name: 'Metaobjetos', to: '/dashboard/conteudo/metaobjetos', icon: Box },
      { name: 'Arquivos', to: '/dashboard/conteudo/arquivos', icon: Files },
      { name: 'Menus', to: '/dashboard/conteudo/menus', icon: MenuIcon },
      { name: 'Posts do Blog', to: '/dashboard/conteudo/blog', icon: BookOpen },
    ],
  },
  {
    name: 'Análises',
    to: '/dashboard/analises',
    icon: BarChart2,
    children: [
      { name: 'Relatórios', to: '/dashboard/analises/relatorios', icon: BarChart },
      { name: 'Live View', to: '/dashboard/analises/live-view', icon: Eye },
    ],
  },
  {
    name: 'Marketing',
    to: '/dashboard/marketing',
    icon: Megaphone,
    children: [
      { name: 'Campanhas', to: '/dashboard/marketing/campanhas', icon: Mail },
      { name: 'Automações', to: '/dashboard/marketing/automacoes', icon: Zap },
    ],
  },
  { name: 'Descontos', to: '/dashboard/descontos', icon: Tag },
  {
    name: 'Canais de Vendas',
    to: '/dashboard/canais-vendas',
    icon: Store,
    children: [
      { name: 'Temas', to: '/dashboard/canais-vendas/temas', icon: Layout },
      { name: 'Posts do Blog', to: '/dashboard/canais-vendas/blog', icon: BookOpen },
      { name: 'Páginas', to: '/dashboard/canais-vendas/paginas', icon: FileText },
      { name: 'Navegação', to: '/dashboard/canais-vendas/navegacao', icon: Globe },
      { name: 'Preferências', to: '/dashboard/canais-vendas/preferencias', icon: Settings },
    ],
  },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const toggleSubmenu = (menuName: string) => {
    setOpenMenus((prev) =>
      prev.includes(menuName)
        ? prev.filter((name) => name !== menuName)
        : [...prev, menuName]
    );
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    // Fecha todos os submenus quando o menu é recolhido
    if (!isCollapsed) {
      setOpenMenus([]);
    }
  };

  return (
    <nav
      className={`bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="sticky top-0 bg-white z-10 p-2 border-b border-gray-200">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center p-2 hover:bg-gray-100 rounded-md"
          title={isCollapsed ? "Expandir menu" : "Recolher menu"}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="h-5 w-5 text-gray-500" />
          ) : (
            <PanelLeftClose className="h-5 w-5 text-gray-500" />
          )}
        </button>
      </div>
      <div className="p-2">
        <ul className="space-y-1">
          {navigation.map((item) => (
            <li key={item.name}>
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleSubmenu(item.name)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 ${
                      openMenus.includes(item.name) ? 'bg-gray-50' : ''
                    }`}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <div className={`flex items-center ${isCollapsed ? 'justify-center w-full' : 'gap-2'}`}>
                      {item.icon && <item.icon className="h-5 w-5 flex-shrink-0" />}
                      {!isCollapsed && <span>{item.name}</span>}
                    </div>
                    {!isCollapsed && (
                      openMenus.includes(item.name) ? (
                        <ChevronDown className="h-4 w-4 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="h-4 w-4 flex-shrink-0" />
                      )
                    )}
                  </button>
                  {openMenus.includes(item.name) && !isCollapsed && (
                    <ul className="ml-6 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <li key={child.name}>
                          <NavLink
                            to={child.to}
                            className={({ isActive }) =>
                              `flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md ${
                                isActive
                                  ? 'bg-gray-100 text-gray-900'
                                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                              }`
                            }
                          >
                            {child.icon && <child.icon className="h-4 w-4 flex-shrink-0" />}
                            <span>{child.name}</span>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center ${isCollapsed ? 'justify-center' : 'gap-2'} px-3 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                  title={isCollapsed ? item.name : undefined}
                >
                  {item.icon && <item.icon className="h-5 w-5 flex-shrink-0" />}
                  {!isCollapsed && <span>{item.name}</span>}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}