import React, { createContext, useContext, useState } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

export interface MenuStyle {
  type: 'default' | 'centered' | 'minimal' | 'fullwidth' | 'sidebar';
  background: string;
  textColor: string;
  hoverColor: string;
  activeColor: string;
  dropdownBackground: string;
  dropdownTextColor: string;
  height: string;
  fontSize: string;
  logoPosition: 'left' | 'center';
  searchPosition: 'left' | 'center' | 'right';
  cartPosition: 'left' | 'right';
}

export interface HeaderStyle {
  position: 'static' | 'fixed' | 'sticky';
  topBar: {
    enabled: boolean;
    background: string;
    textColor: string;
    message: string;
  };
  announcement: {
    enabled: boolean;
    background: string;
    textColor: string;
    message: string;
  };
}

export interface HeroStyle {
  type: 'fullscreen' | 'halfscreen' | 'minimal';
  background: string;
  textColor: string;
  overlayColor: string;
  overlayOpacity: number;
  buttonStyle: 'solid' | 'outline' | 'ghost';
  buttonColor: string;
  buttonTextColor: string;
}

export interface CategoryStyle {
  layout: 'grid' | 'list' | 'carousel';
  cardsPerRow: number;
  background: string;
  cardBackground: string;
  textColor: string;
  iconColor: string;
  borderRadius: string;
  hoverEffect: 'zoom' | 'lift' | 'glow' | 'none';
}

export interface ProductCardStyle {
  layout: 'default' | 'compact' | 'minimal' | 'featured';
  aspectRatio: '1/1' | '3/4' | '4/3' | '16/9';
  background: string;
  textColor: string;
  priceColor: string;
  borderRadius: string;
  hoverEffect: 'zoom' | 'lift' | 'glow' | 'none';
  showRating: boolean;
  showStock: boolean;
  buttonStyle: 'solid' | 'outline' | 'ghost';
}

export interface FooterStyle {
  type: 'default' | 'minimal' | 'centered' | 'multicolumn';
  background: string;
  textColor: string;
  linkColor: string;
  newsletterBackground: string;
  newsletterTextColor: string;
  socialIconsColor: string;
  columns: number;
}

export interface Typography {
  fonts: {
    heading: string;
    body: string;
  };
  scale: number;
  h1: {
    size: string;
    weight: string;
    lineHeight: string;
    fontSize?: string;
  };
  h2: {
    size: string;
    weight: string;
    lineHeight: string;
    fontSize?: string;
  };
  h3: {
    size: string;
    weight: string;
    lineHeight: string;
    fontSize?: string;
  };
  h4: {
    size: string;
    weight: string;
    lineHeight: string;
    fontSize?: string;
  };
  body: {
    size: string;
    weight: string;
    lineHeight: string;
    fontSize?: string;
  };
  small: {
    size: string;
    weight: string;
    lineHeight: string;
    fontSize?: string;
  };
}

export interface ColorScheme {
  primary: string;
  secondary: string;
  tertiary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  error: string;
  success: string;
  warning: string;
  info: string;
}

export interface Layout {
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  container: {
    maxWidth: string;
    padding: string;
  };
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

export interface Theme {
  id: string;
  name: string;
  colors: ColorScheme;
  typography: Typography;
  menu: MenuStyle;
  header: HeaderStyle;
  hero: HeroStyle;
  categories: CategoryStyle;
  productCard: ProductCardStyle;
  footer: FooterStyle;
  layout: Layout;
}

const defaultTheme: Theme = {
  id: 'default',
  name: 'Default Theme',
  colors: {
    primary: '#0066cc',
    secondary: '#4a5568',
    tertiary: '#805ad5',
    accent: '#ed8936',
    background: '#ffffff',
    surface: '#f7fafc',
    text: '#1a202c',
    error: '#e53e3e',
    success: '#38a169',
    warning: '#d69e2e',
    info: '#3182ce'
  },
  typography: {
    fonts: {
      heading: 'Inter, sans-serif',
      body: 'Inter, sans-serif'
    },
    scale: 1.2,
    h1: {
      size: '2.5rem',
      weight: '700',
      lineHeight: '1.2',
      fontSize: '2.5rem'
    },
    h2: {
      size: '2rem',
      weight: '600',
      lineHeight: '1.3',
      fontSize: '2rem'
    },
    h3: {
      size: '1.5rem',
      weight: '600',
      lineHeight: '1.4',
      fontSize: '1.5rem'
    },
    h4: {
      size: '1.25rem',
      weight: '600',
      lineHeight: '1.4',
      fontSize: '1.25rem'
    },
    body: {
      size: '1rem',
      weight: '400',
      lineHeight: '1.5',
      fontSize: '1rem'
    },
    small: {
      size: '0.875rem',
      weight: '400',
      lineHeight: '1.4',
      fontSize: '0.875rem'
    }
  },
  menu: {
    type: 'default',
    background: '#ffffff',
    textColor: '#1a202c',
    hoverColor: '#0066cc',
    activeColor: '#0066cc',
    dropdownBackground: '#ffffff',
    dropdownTextColor: '#1a202c',
    height: '64px',
    fontSize: '1rem',
    logoPosition: 'left',
    searchPosition: 'center',
    cartPosition: 'right'
  },
  header: {
    position: 'sticky',
    topBar: {
      enabled: true,
      background: '#0066cc',
      textColor: '#ffffff',
      message: 'Frete grátis para todo o Brasil'
    },
    announcement: {
      enabled: false,
      background: '#4a5568',
      textColor: '#ffffff',
      message: ''
    }
  },
  hero: {
    type: 'fullscreen',
    background: '#f7fafc',
    textColor: '#1a202c',
    overlayColor: '#000000',
    overlayOpacity: 0.3,
    buttonStyle: 'solid',
    buttonColor: '#0066cc',
    buttonTextColor: '#ffffff'
  },
  categories: {
    layout: 'grid',
    cardsPerRow: 4,
    background: '#ffffff',
    cardBackground: '#f7fafc',
    textColor: '#1a202c',
    iconColor: '#0066cc',
    borderRadius: '0.5rem',
    hoverEffect: 'lift'
  },
  productCard: {
    layout: 'default',
    aspectRatio: '1/1',
    background: '#ffffff',
    textColor: '#1a202c',
    priceColor: '#0066cc',
    borderRadius: '0.5rem',
    hoverEffect: 'lift',
    showRating: true,
    showStock: true,
    buttonStyle: 'solid'
  },
  footer: {
    type: 'multicolumn',
    background: '#1a202c',
    textColor: '#ffffff',
    linkColor: '#e2e8f0',
    newsletterBackground: '#2d3748',
    newsletterTextColor: '#ffffff',
    socialIconsColor: '#0066cc',
    columns: 4
  },
  layout: {
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem'
    },
    container: {
      maxWidth: '1280px',
      padding: '1rem'
    },
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px'
    }
  }
};

interface ThemeContextType {
  currentTheme: Theme;
  updateTheme: (updates: Partial<Theme>) => void;
  resetTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(defaultTheme);

  const updateTheme = (updates: Partial<Theme>) => {
    setCurrentTheme(prevTheme => ({
      ...prevTheme,
      ...updates
    }));
  };

  const resetTheme = () => {
    setCurrentTheme(defaultTheme);
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, updateTheme, resetTheme }}>
      <StyledThemeProvider theme={currentTheme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
