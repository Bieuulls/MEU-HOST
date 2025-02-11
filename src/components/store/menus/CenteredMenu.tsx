import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu as MenuIcon, Heart } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import styled from 'styled-components';

interface CenteredMenuProps {
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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: ${props => props.$menu.textColor};

  @media (max-width: 768px) {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    height: auto;
  }
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  color: inherit;
`;

const SearchContainer = styled.div`
  width: 100%;
  max-width: 500px;
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
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    text-align: center;
  }
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

const MobileMenuButton = styled(IconButton)`
  display: none;
  position: absolute;
  top: 1rem;
  left: 1rem;

  @media (max-width: 768px) {
    display: block;
  }
`;

export function CenteredMenu({ cartCount, onSearch }: CenteredMenuProps) {
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
      <MobileMenuButton
        $menu={menu}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <MenuIcon size={24} />
      </MobileMenuButton>

      <MenuContent $menu={menu}>
        <Logo to="/">LOGO</Logo>

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

        <NavLinks $menu={menu} style={{ display: isMobileMenuOpen ? 'flex' : 'none' }}>
          <Link to="/produtos">Produtos</Link>
          <Link to="/categorias">Categorias</Link>
          <Link to="/ofertas">Ofertas</Link>
          <Link to="/contato">Contato</Link>
        </NavLinks>

        <IconsContainer>
          <IconButton $menu={menu} as={Link} to="/favoritos">
            <Heart size={24} />
          </IconButton>

          <IconButton $menu={menu} as={Link} to="/carrinho">
            <ShoppingCart size={24} />
            {cartCount > 0 && <CartCount $menu={menu}>{cartCount}</CartCount>}
          </IconButton>
        </IconsContainer>
      </MenuContent>
    </MenuContainer>
  );
}
