import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, Menu as MenuIcon, Heart } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import styled from 'styled-components';

interface DefaultMenuProps {
  cartCount: number;
  onSearch: (query: string) => void;
}

const MenuContainer = styled.nav<{ $menu: any }>`
  position: relative;
  background: ${props => props.$menu.background};
  height: ${props => props.$menu.height};
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

const MenuContent = styled.div<{ $menu: any }>`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  color: ${props => props.$menu.textColor};
`;

const Logo = styled(Link)<{ $position: 'left' | 'center' }>`
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  color: inherit;
  order: ${props => props.$position === 'center' ? 0 : -1};
`;

const SearchContainer = styled.div<{ $position: 'left' | 'center' | 'right' }>`
  flex: 1;
  max-width: 500px;
  order: ${props => {
    switch(props.$position) {
      case 'left': return -1;
      case 'right': return 1;
      default: return 0;
    }
  }};
`;

const SearchInput = styled.input<{ $menu: any }>`
  width: 100%;
  padding: 0.5rem 2.5rem 0.5rem 1rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.375rem;
  font-size: ${props => props.$menu.fontSize};
  background: ${props => props.$menu.dropdownBackground};
  color: ${props => props.$menu.dropdownTextColor};

  &:focus {
    outline: none;
    border-color: ${props => props.$menu.hoverColor};
    box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.1);
  }
`;

const NavLinks = styled.div<{ $menu: any }>`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  a {
    text-decoration: none;
    color: inherit;
    font-size: ${props => props.$menu.fontSize};
    transition: color 0.2s;

    &:hover {
      color: ${props => props.$menu.hoverColor};
    }

    &.active {
      color: ${props => props.$menu.activeColor};
    }
  }
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

const MobileMenuButton = styled(IconButton)`
  display: none;
  @media (max-width: 768px) {
    display: block;
  }
`;

const DesktopNav = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileNav = styled.div<{ $isOpen: boolean, $menu: any }>`
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${props => props.$menu.background};
  padding: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  transform: translateY(${props => props.$isOpen ? '0' : '-100%'});
  opacity: ${props => props.$isOpen ? '1' : '0'};
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    display: block;
  }
`;

export function DefaultMenu({ cartCount, onSearch }: DefaultMenuProps) {
  const { currentTheme } = useTheme();
  const { menu } = currentTheme;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <MenuContainer $menu={menu}>
      <MenuContent $menu={menu}>
        <MobileMenuButton
          $menu={menu}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <MenuIcon size={24} />
        </MobileMenuButton>

        <Logo to="/" $position={menu.logoPosition}>
          LOGO
        </Logo>

        <DesktopNav>
          <SearchContainer $position={menu.searchPosition}>
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

          <IconButton $menu={menu} as={Link} to="/favoritos">
            <Heart size={24} />
          </IconButton>

          <IconButton $menu={menu} as={Link} to="/carrinho">
            <ShoppingCart size={24} />
            {cartCount > 0 && <CartCount $menu={menu}>{cartCount}</CartCount>}
          </IconButton>
        </DesktopNav>

        <MobileNav $isOpen={isMobileMenuOpen} $menu={menu}>
          <SearchContainer $position="center">
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
        </MobileNav>
      </MenuContent>
    </MenuContainer>
  );
}
