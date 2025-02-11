import { useTheme } from '../../../contexts/ThemeContext';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getThemeById } from '../../../themes';
import styled from 'styled-components';
import { ShoppingCart, Heart, Search, Menu, X, Home, Package, Grid, Tag, MessageCircle } from 'lucide-react';

const TopBar = styled.div<{ $show: boolean }>`
  display: ${props => props.$show ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  height: ${props => props.theme.layout.header.topBar.height};
  background-color: ${props => props.theme.layout.header.topBar.backgroundColor};
  color: ${props => props.theme.layout.header.topBar.textColor};
  padding: 0 1rem;
  text-align: center;
`;

const Header = styled.header<{ $sticky: boolean }>`
  position: ${props => props.$sticky ? 'sticky' : 'relative'};
  top: 0;
  z-index: 50;
  height: ${props => props.theme.layout.header.height};
  background-color: ${props => props.theme.colors.background.primary};
  border-bottom: 1px solid ${props => props.theme.colors.background.tertiary};
`;

const HeaderContent = styled.div`
  max-width: ${props => props.theme.spacing.container.maxWidth};
  margin: 0 auto;
  padding: 0 1rem;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    .search-container {
      order: 3;
      width: 100%;
    }
    
    .logo-container {
      order: 1;
    }
    
    .actions-container {
      order: 2;
    }
  }

  @media (min-width: 768px) {
    padding: 0 2rem;
  }
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text.primary};
`;

const Nav = styled.nav`
  display: none;
  
  @media (max-width: 1024px) {
    display: none;
  }

  @media (min-width: 1024px) {
    display: flex;
    gap: 2rem;
  }
`;

const NavLink = styled.a`
  color: ${props => props.theme.layout.menu.textColor};
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;

  &:hover {
    color: ${props => props.theme.layout.menu.hoverColor};
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.text.primary};
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &:hover {
    color: ${props => props.theme.colors.primaryHover};
  }
`;

const CartCount = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: ${props => props.theme.colors.accent};
  color: white;
  font-size: 0.75rem;
  padding: 0.125rem 0.375rem;
  border-radius: 9999px;
`;

const SearchBar = styled.div`
  position: relative;
  flex: 1;
  max-width: 600px;
  margin: 0 2rem;

  @media (max-width: 768px) {
    margin: 0;
    order: 3;
    max-width: 100%;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid ${props => props.theme.colors.background.tertiary};
  border-radius: 0.375rem;
  background-color: ${props => props.theme.colors.background.secondary};
  color: ${props => props.theme.colors.text.primary};

  &::placeholder {
    color: ${props => props.theme.colors.text.tertiary};
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

interface HeroSection {
  id: number;
  title: string;
  description: string;
  image: string;
  buttonText: string;
  buttonLink: string;
}

const hero: HeroSection = {
  id: 1,
  title: "Promoções de Verão",
  description: "Aproveite as melhores ofertas da estação! Descontos imperdíveis em produtos selecionados.",
  image: "/images/hero.jpg",
  buttonText: "Comprar Agora",
  buttonLink: "#"
};

const Banner = styled.div<{ $height: string; $backgroundImage: string }>`
  position: relative;
  height: ${props => props.$height};
  background-image: url(${props => props.$backgroundImage});
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3));
  }
`;

const BannerContent = styled.div`
  max-width: ${props => props.theme.spacing.container.maxWidth};
  margin: 0 auto;
`;

const BannerTitle = styled.h1`
  font-family: ${props => props.theme.typography.fonts.heading};
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Button = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${props => props.theme.colors.primaryHover};
  }
`;

const Notice = styled.div<{ $type: 'shipping' | 'security' }>`
  background-color: ${props => props.theme.layout.notices[props.$type].backgroundColor};
  color: ${props => props.theme.layout.notices[props.$type].textColor};
  padding: 0.75rem;
  text-align: center;
  font-size: 0.875rem;
`;

const CategoriesGrid = styled.div`
  display: grid;
  gap: 1rem;
  padding: 2rem 1rem;
  
  grid-template-columns: repeat(2, 1fr);
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
    padding: 2rem;
  }
`;

const StyledCategoryItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background-color: ${props => props.theme.colors.background.secondary};
  border-radius: 0.5rem;
  transition: transform 0.2s;
  cursor: pointer;
  text-align: center;

  &:hover {
    transform: translateY(-2px);
  }

  .icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }

  .name {
    font-weight: 600;
    margin-bottom: 0.25rem;
    color: ${props => props.theme.colors.text.primary};
  }

  .description {
    font-size: 0.875rem;
    color: ${props => props.theme.colors.text.secondary};
    
    @media (max-width: 640px) {
      display: none;
    }
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  gap: 1.5rem;
  padding: 1rem;
  
  grid-template-columns: repeat(1, 1fr);
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
    padding: 2rem;
  }
`;

const StyledProductCard = styled.div`
  background-color: ${props => props.theme.colors.background.primary};
  border: 1px solid ${props => props.theme.colors.background.tertiary};
  border-radius: 0.5rem;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const ProductImage = styled.div`
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  background-color: ${props => props.theme.colors.background.secondary};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
  }

  &:hover {
    img {
      transform: scale(1.05);
    }
  }
`;

const ProductLabel = styled.span`
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  background-color: ${props => props.theme.colors.accent};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const ProductActions = styled.div`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  opacity: 0;
  transform: translateX(10px);
  transition: opacity 0.2s, transform 0.2s;

  ${StyledProductCard}:hover & {
    opacity: 1;
    transform: translateX(0);
  }
`;

const ProductInfo = styled.div`
  padding: 1rem;
`;

const ProductTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text.primary};
`;

const ProductPrice = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 1rem;

  .current-price {
    font-size: 1.25rem;
    font-weight: 600;
    color: ${props => props.theme.colors.text.primary};
  }

  .original-price {
    font-size: 0.875rem;
    color: ${props => props.theme.colors.text.tertiary};
    text-decoration: line-through;
  }
`;

const AddToCartButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${props => props.theme.colors.primaryHover};
  }
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.accent};
`;

const Footer = styled.footer`
  background-color: ${props => props.theme.colors.background.secondary};
  padding: ${props => props.theme.spacing.section.padding.desktop};
  margin-top: ${props => props.theme.spacing.section.margin.desktop};
`;

const MobileMenu = styled.div<{ $isOpen: boolean }>`
  display: none;
  
  @media (max-width: 1024px) {
    display: ${props => props.$isOpen ? 'block' : 'none'};
    position: fixed;
    top: ${props => props.theme.layout.header.height};
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${props => props.theme.colors.background.primary};
    z-index: 50;
    overflow-y: auto;
    padding: 1rem;
  }
`;

const MobileNavigation = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.background.tertiary};
  margin-bottom: 1rem;
`;

const MobileNavLink = styled.a`
  display: flex;
  align-items: center;
  padding: 0.75rem;
  color: ${props => props.theme.colors.text.primary};
  text-decoration: none;
  font-weight: 500;
  border-radius: 0.375rem;

  &:hover {
    background-color: ${props => props.theme.colors.background.secondary};
  }
`;

const MobileCategories = styled.div`
  h3 {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: ${props => props.theme.colors.text.primary};
  }
`;

const MobileCategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
`;

const MobileCategoryItem = styled.a`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background-color: ${props => props.theme.colors.background.secondary};
  border-radius: 0.375rem;
  text-decoration: none;

  .icon {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }

  .name {
    font-size: 0.875rem;
    font-weight: 500;
    color: ${props => props.theme.colors.text.primary};
    text-align: center;
  }
`;

export function StorePreview() {
  const { currentTheme, updateTheme } = useTheme();
  const [cartCount, setCartCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { themeId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (themeId) {
      setIsLoading(true);
      const theme = getThemeById(themeId);
      if (theme) {
        updateTheme(theme);
      } else {
        console.error(`Theme with id ${themeId} not found`);
        navigate('/');
      }
      setIsLoading(false);
    }
  }, [themeId, updateTheme, navigate]);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        backgroundColor: currentTheme.colors.background,
        color: currentTheme.colors.text
      }}>
        Carregando tema...
      </div>
    );
  }

  const categories = [
    { id: 1, name: 'Eletrônicos', icon: '💻', description: 'Gadgets e dispositivos' },
    { id: 2, name: 'Roupas', icon: '👕', description: 'Moda masculina e feminina' },
    { id: 3, name: 'Acessórios', icon: '👜', description: 'Complementos para seu estilo' },
    { id: 4, name: 'Casa', icon: '🏠', description: 'Decoração e utilidades' },
    { id: 5, name: 'Esportes', icon: '⚽', description: 'Equipamentos esportivos' },
    { id: 6, name: 'Livros', icon: '📚', description: 'Literatura e conhecimento' }
  ];

  const products = [
    {
      id: 1,
      name: 'Smartphone XYZ',
      price: 'R$ 1.999,99',
      image: 'https://via.placeholder.com/400',
      rating: 4.5,
      reviews: 128,
      label: 'Novo',
      isNew: true
    },
    {
      id: 2,
      name: 'Notebook Pro',
      price: 'R$ 4.499,99',
      image: 'https://via.placeholder.com/400',
      rating: 4.8,
      reviews: 256,
      label: 'Oferta',
      isOnSale: true
    },
    {
      id: 3,
      name: 'Fone de Ouvido',
      price: 'R$ 299,99',
      image: 'https://via.placeholder.com/400',
      rating: 4.2,
      reviews: 64
    },
    {
      id: 4,
      name: 'Smartwatch',
      price: 'R$ 899,99',
      image: 'https://via.placeholder.com/400',
      rating: 4.6,
      reviews: 92,
      isNew: true
    }
  ];

  const handleAddToCart = () => {
    setCartCount(prev => prev + 1);
  };

  const CategoryItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <StyledCategoryItem>{children}</StyledCategoryItem>
  );

  const ProductCard: React.FC<{ product: { name: string; price: string; image: string; rating: number; reviews: number; label?: string; isNew?: boolean; isOnSale?: boolean } }> = ({ product }) => (
    <StyledProductCard>
      <ProductImage>
        <img src={product.image} alt={product.name} />
        {(product.isNew || product.isOnSale) && (
          <ProductLabel>
            {product.isNew ? 'Novo' : 'Oferta'}
          </ProductLabel>
        )}
        <ProductActions>
          <IconButton title="Adicionar aos favoritos">
            <Heart size={20} />
          </IconButton>
          <IconButton title="Visualização rápida">
            <Search size={20} />
          </IconButton>
        </ProductActions>
      </ProductImage>
      
      <ProductInfo>
        <Rating>
          {'★'.repeat(Math.floor(product.rating))}
          {'☆'.repeat(5 - Math.floor(product.rating))}
          <span style={{ 
            color: currentTheme.colors.text.secondary,
            fontSize: '0.875rem',
            marginLeft: '0.5rem'
          }}>
            ({product.reviews})
          </span>
        </Rating>
        
        <ProductTitle>{product.name}</ProductTitle>
        
        <ProductPrice>
          <span className="current-price">{product.price}</span>
          {product.isOnSale && (
            <span className="original-price">
              R$ {(parseFloat(product.price.replace('R$ ', '').replace('.', '').replace(',', '.')) * 1.2).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          )}
        </ProductPrice>
        
        <AddToCartButton onClick={handleAddToCart}>
          Adicionar ao Carrinho
        </AddToCartButton>
      </ProductInfo>
    </StyledProductCard>
  );

  return (
    <div>
      {/* Top Bar */}
      <TopBar $show={currentTheme.header.topBar.enabled}>
        {currentTheme.header.topBar.message}
      </TopBar>

      {/* Header */}
      <Header $sticky={currentTheme.header.position === 'sticky'}>
        <HeaderContent>
          <div className="logo-container flex items-center">
            <IconButton className="lg:hidden mr-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </IconButton>
            <Logo>LOGO</Logo>
          </div>

          <div className="search-container">
            <SearchBar>
              <Search 
                size={20} 
                color={currentTheme.colors.tertiary}
                style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}
              />
              <SearchInput placeholder="Buscar produtos..." />
            </SearchBar>
          </div>

          {/* Desktop Navigation */}
          <Nav>
            <NavLink href="#">Início</NavLink>
            <NavLink href="#">Produtos</NavLink>
            <NavLink href="#">Categorias</NavLink>
            <NavLink href="#">Ofertas</NavLink>
            <NavLink href="#">Contato</NavLink>
          </Nav>

          <div className="actions-container">
            <Actions>
              <IconButton>
                <Heart size={24} />
              </IconButton>
              <IconButton>
                <ShoppingCart size={24} />
                {cartCount > 0 && <CartCount>{cartCount}</CartCount>}
              </IconButton>
            </Actions>
          </div>
        </HeaderContent>

        {/* Mobile Menu */}
        <MobileMenu $isOpen={mobileMenuOpen}>
          <MobileNavigation>
            <MobileNavLink href="#">
              <Home size={20} className="mr-3" />
              Início
            </MobileNavLink>
            <MobileNavLink href="#">
              <Package size={20} className="mr-3" />
              Produtos
            </MobileNavLink>
            <MobileNavLink href="#">
              <Grid size={20} className="mr-3" />
              Categorias
            </MobileNavLink>
            <MobileNavLink href="#">
              <Tag size={20} className="mr-3" />
              Ofertas
            </MobileNavLink>
            <MobileNavLink href="#">
              <MessageCircle size={20} className="mr-3" />
              Contato
            </MobileNavLink>
          </MobileNavigation>
        </MobileMenu>
      </Header>

      {/* Hero Section */}
      <Banner 
        $height={currentTheme.layout.banner.height.desktop}
        $backgroundImage={hero.image}
      >
        <BannerContent>
          <BannerTitle>{hero.title}</BannerTitle>
          <Button>{hero.buttonText}</Button>
        </BannerContent>
      </Banner>

      {/* Categories Section */}
      <section>
        <div style={{ 
          maxWidth: currentTheme.spacing.container.maxWidth, 
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: currentTheme.typography.h2.fontSize,
            fontWeight: '600',
            marginBottom: '1rem',
            textAlign: 'center',
            padding: '2rem 0 1rem'
          }}>
            Categorias
          </h2>
          
          <CategoriesGrid>
            {categories.map(category => (
              <CategoryItem key={category.id}>
                <span className="icon">{category.icon}</span>
                <h3 className="name">{category.name}</h3>
                <p className="description">{category.description}</p>
              </CategoryItem>
            ))}
          </CategoriesGrid>
        </div>
      </section>

      {/* Products */}
      <section>
        <div style={{ 
          maxWidth: currentTheme.spacing.container.maxWidth, 
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: currentTheme.typography.h2.fontSize,
            fontWeight: '600',
            marginBottom: '1rem',
            textAlign: 'center',
            padding: '2rem 1rem 1rem'
          }}>
            Produtos em Destaque
          </h2>
          
          <ProductsGrid>
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ProductsGrid>
        </div>
      </section>

      {/* Footer */}
      <Footer>
        <div style={{ 
          maxWidth: currentTheme.spacing.container.maxWidth,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '2rem'
        }}>
          <div>
            <h4 style={{
              fontFamily: currentTheme.typography.fonts.heading,
              fontSize: currentTheme.typography.h4.fontSize,
              marginBottom: '1rem'
            }}>
              Sobre
            </h4>
            <p>Quem Somos</p>
            <p>Nossa História</p>
            <p>Blog</p>
          </div>
          <div>
            <h4 style={{
              fontFamily: currentTheme.typography.fonts.heading,
              fontSize: currentTheme.typography.h4.fontSize,
              marginBottom: '1rem'
            }}>
              Ajuda
            </h4>
            <p>FAQ</p>
            <p>Envio</p>
            <p>Devoluções</p>
          </div>
          <div>
            <h4 style={{
              fontFamily: currentTheme.typography.fonts.heading,
              fontSize: currentTheme.typography.h4.fontSize,
              marginBottom: '1rem'
            }}>
              Contato
            </h4>
            <p>Email</p>
            <p>Telefone</p>
            <p>WhatsApp</p>
          </div>
          <div>
            <h4 style={{
              fontFamily: currentTheme.typography.fonts.heading,
              fontSize: currentTheme.typography.h4.fontSize,
              marginBottom: '1rem'
            }}>
              Newsletter
            </h4>
            <SearchInput placeholder="Seu email..." style={{ marginBottom: '1rem' }} />
            <Button>Inscrever-se</Button>
          </div>
        </div>
      </Footer>
    </div>
  );
}
