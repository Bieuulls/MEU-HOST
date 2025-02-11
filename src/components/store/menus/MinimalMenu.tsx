import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, Menu as MenuIcon, Heart } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import styled from 'styled-components';

interface MinimalMenuProps {
  cartCount: number;
  onSearch: (query: string) => void;
}

const MenuContainer = styled.nav<{ $menu: any }>`
  position: relative;
  background: ${props => props.$menu.background};
  height: ${props => props.$menu.height};
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
`;

const MenuContent = styled.div<{ $menu: any }>`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${props => props.$menu.textColor};
`;

const Logo = styled(Link)`
  font-size: 1.25rem;
  font-weight: 500;
  text-decoration: none;
  color: inherit;
  letter-spacing: -0.025em;
`;

const SearchContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: inherit;
  padding: 0.5rem;
  transform: translateY(-100%);
  transition: transform 0.3s ease;
  z-index: 50;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);

  &.active {
    transform: translateY(0);
  }
`;

const SearchInput = styled.input<{ $menu: any }>`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  display: block;
  padding: 0.5rem 1rem;
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
  gap: 2rem;

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

  @media (max-width: 768px) {
    display: none;
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

const MobileNav = styled.div<{ $isOpen: boolean, $menu: any }>`
  position: fixed;
  top: ${props => props.$menu.height};
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => props.$menu.background};
  padding: 2rem;
  transform: translateX(${props => props.$isOpen ? '0' : '100%'});
  transition: transform 0.3s ease;
  z-index: 40;

  a {
    display: block;
    padding: 0.75rem 0;
    text-decoration: none;
    color: inherit;
    font-size: ${props => props.$menu.fontSize};
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);

    &:hover {
      color: ${props => props.$menu.hoverColor};
    }
  }
`;

const MobileMenuButton = styled(IconButton)`
  display: none;
  @media (max-width: 768px) {
    display: block;
  }
`;

export function MinimalMenu({ cartCount, onSearch }: MinimalMenuProps) {
  const { currentTheme } = useTheme();
  const { menu } = currentTheme;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
    setIsSearchOpen(false);
  };

  return (
    <MenuContainer $menu={menu}>
      <SearchContainer className={isSearchOpen ? 'active' : ''}>
        <form onSubmit={handleSearch}>
          <SearchInput
            $menu={menu}
            type="text"
            placeholder="Buscar produtos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </form>
      </SearchContainer>

      <MenuContent $menu={menu}>
        <MobileMenuButton
          $menu={menu}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <MenuIcon size={20} />
        </MobileMenuButton>

        <Logo to="/">LOGO</Logo>

        <NavLinks $menu={menu}>
          <Link to="/produtos">Produtos</Link>
          <Link to="/categorias">Categorias</Link>
          <Link to="/ofertas">Ofertas</Link>
          <Link to="/contato">Contato</Link>
        </NavLinks>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <IconButton $menu={menu} onClick={() => setIsSearchOpen(!isSearchOpen)}>
            <Search size={20} />
          </IconButton>

          <IconButton $menu={menu} as={Link} to="/favoritos">
            <Heart size={20} />
          </IconButton>

          <IconButton $menu={menu} as={Link} to="/carrinho">
            <ShoppingCart size={20} />
            {cartCount > 0 && <CartCount $menu={menu}>{cartCount}</CartCount>}
          </IconButton>
        </div>
      </MenuContent>

      <MobileNav $isOpen={isMobileMenuOpen} $menu={menu}>
        <Link to="/produtos">Produtos</Link>
        <Link to="/categorias">Categorias</Link>
        <Link to="/ofertas">Ofertas</Link>
        <Link to="/contato">Contato</Link>
      </MobileNav>
    </MenuContainer>
  );
}
