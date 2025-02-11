import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  Search, 
  Menu, 
  X, 
  ChevronDown,
  User,
  Heart
} from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  onSearch: (query: string) => void;
}

export function Header({ cartCount, onSearch }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    {
      name: 'Eletrônicos',
      subcategories: ['Smartphones', 'Notebooks', 'Tablets', 'Acessórios']
    },
    {
      name: 'Moda',
      subcategories: ['Masculino', 'Feminino', 'Infantil', 'Acessórios']
    },
    {
      name: 'Casa',
      subcategories: ['Decoração', 'Móveis', 'Utensílios', 'Jardim']
    }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <header className="bg-white shadow-sm">
      {/* Top Bar */}
      <div className="bg-gray-900 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <div>Frete grátis para compras acima de R$ 200</div>
            <div className="flex gap-4">
              <Link to="/conta" className="hover:text-gray-300">Minha Conta</Link>
              <Link to="/favoritos" className="hover:text-gray-300">Favoritos</Link>
              <Link to="/atendimento" className="hover:text-gray-300">Atendimento</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-600 hover:text-gray-900"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
            <Link to="/" className="text-2xl font-bold text-gray-900">
              LOGO
            </Link>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="hidden md:block w-full">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="O que você procura?"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </form>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="md:hidden text-gray-600 hover:text-gray-900"
            >
              <Search className="h-6 w-6" />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6">
            <Link to="/conta" className="hidden md:flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <User className="h-6 w-6" />
              <span className="text-sm">Conta</span>
            </Link>
            <Link to="/favoritos" className="hidden md:flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <Heart className="h-6 w-6" />
              <span className="text-sm">Favoritos</span>
            </Link>
            <Link to="/carrinho" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <div className="relative">
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden md:inline text-sm">Carrinho</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            {/* Categories Menu */}
            <div className="hidden md:flex items-center gap-6">
              {categories.map((category) => (
                <div key={category.name} className="relative group">
                  <button className="flex items-center gap-1 py-3 text-gray-600 hover:text-gray-900">
                    {category.name}
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <div className="absolute top-full left-0 w-48 bg-white shadow-lg rounded-md py-2 hidden group-hover:block z-50">
                    {category.subcategories.map((sub) => (
                      <Link
                        key={sub}
                        to={`/categoria/${category.name.toLowerCase()}/${sub.toLowerCase()}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {sub}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-white">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold">Menu</span>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleSearch} className="mt-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="O que você procura?"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </form>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-6">
                {categories.map((category) => (
                  <div key={category.name}>
                    <div className="font-medium text-gray-900 mb-2">{category.name}</div>
                    <div className="ml-4 space-y-2">
                      {category.subcategories.map((sub) => (
                        <Link
                          key={sub}
                          to={`/categoria/${category.name.toLowerCase()}/${sub.toLowerCase()}`}
                          className="block text-gray-600 hover:text-gray-900 py-1"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {sub}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
