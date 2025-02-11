import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu as MenuIcon, Heart, X } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import styled from 'styled-components';

interface SidebarMenuProps {
  cartCount: number;
  onSearch: (query: string) => void;
}

const MenuContainer = styled.nav<{ $menu: any }>`
  position: relative;
  background: ${props => props.$menu.background};
  height: ${props => props.$menu.height};
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  z-index: 50;
`;

const TopBar = styled.div<{ $menu: any }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  height: 100%;
  max-width: 1280px;
  margin: 0 auto;
  color: ${props => props.$menu.textColor};
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  color: inherit;
`;

const IconsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const IconButton = styled.button<{ $menu: any }>`
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: inherit;
  position: relative;
  transition: color 0.2s;

  &:hover {
    color: ${props => props.$menu.hoverColor};
  }
`;

const CartCount = styled.span<{ $menu: any }>`
  position: absolute;
  top: -0.25rem;
  right: -0.25rem;
  background: ${props => props.$menu.hoverColor};
  color: white;
  font-size: 0.75rem;
  padding: 0.125rem 0.375rem;
  border-radius: 9999px;
  font-weight: 500;
`;

const Sidebar = styled.div<{ $isOpen: boolean, $menu: any }>`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 300px;
  background: ${props => props.$menu.dropdownBackground};
  padding: 2rem;
  transform: translateX(${props => props.$isOpen ? '0' : '-100%'});
  transition: transform 0.3s ease;
  z-index: 60;
  overflow-y: auto;
`;

const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  opacity: ${props => props.$isOpen ? '1' : '0'};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
  z-index: 55;
`;

const CloseButton = styled(IconButton)`
  position: absolute;
  top: 1rem;
  right: 1rem;
`;

const SearchContainer = styled.div`
  margin: 2rem 0;
`;

const SearchInput = styled.input<{ $menu: any }>`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.375rem;
  font-size: ${props => props.$menu.fontSize};
  background: ${props => props.$menu.background};
  color: ${props => props.$menu.textColor};

  &:focus {
    outline: none;
    border-color: ${props => props.$menu.hoverColor};
    box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.1);
  }
`;

const NavLinks = styled.div<{ $menu: any }>`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  a {
    text-decoration: none;
    color: inherit;
    font-size: ${props => props.$menu.fontSize};
    padding: 0.75rem;
    border-radius: 0.375rem;
    transition: all 0.2s;

    &:hover {
      color: ${props => props.$menu.hoverColor};
      background: rgba(0, 0, 0, 0.05);
    }

    &.active {
      color: ${props => props.$menu.activeColor};
      background: rgba(0, 0, 0, 0.05);
    }
  }
`;

const Categories = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
`;

const CategoryTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  color: inherit;
  opacity: 0.7;
  margin-bottom: 1rem;
`;

export function SidebarMenu({ cartCount, onSearch }: SidebarMenuProps) {
  const { currentTheme } = useTheme();
  const { menu } = currentTheme;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <>
      <MenuContainer $menu={menu}>
        <TopBar $menu={menu}>
          <IconButton $menu={menu} onClick={() => setIsSidebarOpen(true)}>
            <MenuIcon size={24} />
          </IconButton>

          <Logo to="/">LOGO</Logo>

          <IconsContainer>
            <IconButton $menu={menu} as={Link} to="/favoritos">
              <Heart size={24} />
            </IconButton>

            <IconButton $menu={menu} as={Link} to="/carrinho">
              <ShoppingCart size={24} />
              {cartCount > 0 && <CartCount $menu={menu}>{cartCount}</CartCount>}
            </IconButton>
          </IconsContainer>
        </TopBar>
      </MenuContainer>

      <Overlay $isOpen={isSidebarOpen} onClick={() => setIsSidebarOpen(false)} />

      <Sidebar $isOpen={isSidebarOpen} $menu={menu}>
        <CloseButton $menu={menu} onClick={() => setIsSidebarOpen(false)}>
          <X size={24} />
        </CloseButton>

        <SearchContainer>
          <form onSubmit={handleSearch}>
            <SearchInput
              $menu={menu}
              type="text"
              placeholder="Buscar produtos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </SearchContainer>

        <NavLinks $menu={menu}>
          <Link to="/produtos">Produtos</Link>
          <Link to="/categorias">Categorias</Link>
          <Link to="/ofertas">Ofertas</Link>
          <Link to="/contato">Contato</Link>
        </NavLinks>

        <Categories>
          <CategoryTitle>Categorias</CategoryTitle>
          <NavLinks $menu={menu}>
            <Link to="/categoria/eletronicos">Eletrônicos</Link>
            <Link to="/categoria/computadores">Computadores</Link>
            <Link to="/categoria/acessorios">Acessórios</Link>
            <Link to="/categoria/casa">Casa</Link>
            <Link to="/categoria/esportes">Esportes</Link>
            <Link to="/categoria/livros">Livros</Link>
          </NavLinks>
        </Categories>
      </Sidebar>
    </>
  );
}
