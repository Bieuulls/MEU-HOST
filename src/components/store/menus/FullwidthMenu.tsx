import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu as MenuIcon, Heart } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import styled from 'styled-components';

interface FullwidthMenuProps {
  cartCount: number;
  onSearch: (query: string) => void;
}

const MenuContainer = styled.nav<{ $menu: any }>`
  position: relative;
  background: ${props => props.$menu.background};
  height: auto;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

const TopBar = styled.div<{ $menu: any }>`
  background: ${props => props.$menu.dropdownBackground};
  padding: 0.5rem 2rem;
  color: ${props => props.$menu.dropdownTextColor};
  font-size: 0.875rem;
  text-align: center;
`;

const MainMenu = styled.div<{ $menu: any }>`
  padding: 1rem 2rem;
  height: ${props => props.$menu.height};
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${props => props.$menu.textColor};
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  color: inherit;
`;

const SearchContainer = styled.div`
  flex: 1;
  max-width: 600px;
  margin: 0 2rem;
`;

const SearchInput = styled.input<{ $menu: any }>`
  width: 100%;
  padding: 0.75rem 1rem;
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

const NavBar = styled.div<{ $menu: any }>`
  background: ${props => props.$menu.dropdownBackground};
  padding: 0.75rem 2rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLinks = styled.div<{ $menu: any }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;

  a {
    text-decoration: none;
    color: inherit;
    font-size: ${props => props.$menu.fontSize};
    transition: color 0.2s;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;

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

const MobileMenuButton = styled(IconButton)`
  display: none;
  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileNav = styled.div<{ $isOpen: boolean, $menu: any }>`
  display: none;
  @media (max-width: 768px) {
    display: block;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: ${props => props.$menu.background};
    padding: 1rem;
    transform: translateY(${props => props.$isOpen ? '0' : '-100%'});
    opacity: ${props => props.$isOpen ? '1' : '0'};
    transition: all 0.3s ease;
    z-index: 50;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);

    a {
      display: block;
      padding: 0.75rem 1rem;
      text-decoration: none;
      color: inherit;
      font-size: ${props => props.$menu.fontSize};
      transition: color 0.2s;

      &:hover {
        color: ${props => props.$menu.hoverColor};
        background: rgba(0, 0, 0, 0.05);
      }
    }
  }
`;

export function FullwidthMenu({ cartCount, onSearch }: FullwidthMenuProps) {
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
      <TopBar $menu={menu}>
        Frete grátis para todo o Brasil!
      </TopBar>

      <MainMenu $menu={menu}>
        <MobileMenuButton
          $menu={menu}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <MenuIcon size={24} />
        </MobileMenuButton>

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

        <IconsContainer>
          <IconButton $menu={menu} as={Link} to="/favoritos">
            <Heart size={24} />
          </IconButton>

          <IconButton $menu={menu} as={Link} to="/carrinho">
            <ShoppingCart size={24} />
            {cartCount > 0 && <CartCount $menu={menu}>{cartCount}</CartCount>}
          </IconButton>
        </IconsContainer>
      </MainMenu>

      <NavBar $menu={menu}>
        <NavLinks $menu={menu}>
          <Link to="/produtos">Produtos</Link>
          <Link to="/categorias">Categorias</Link>
          <Link to="/ofertas">Ofertas</Link>
          <Link to="/contato">Contato</Link>
        </NavLinks>
      </NavBar>

      <MobileNav $isOpen={isMobileMenuOpen} $menu={menu}>
        <Link to="/produtos">Produtos</Link>
        <Link to="/categorias">Categorias</Link>
        <Link to="/ofertas">Ofertas</Link>
        <Link to="/contato">Contato</Link>
      </MobileNav>
    </MenuContainer>
  );
}
