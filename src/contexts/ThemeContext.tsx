import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { themeService } from '../services/themeService';
import { useTenant } from './TenantContext';

// Move ThemeSettings interface to types file
import { ThemeSettings } from '../types';

const defaultTheme: ThemeSettings = {
  carousel: {
    showControls: true,
    showIndicators: true,
    backgroundColor: '#000000',
    useGradient: true,
    fullWidth: true,
    autoplay: true,
    autoplayTime: 5000,
    showProgressBar: true,
    transition: 'slide',
    transitionSpeed: 'normal',
    slides: [
      {
        image: 'https://placehold.co/1920x1080/404040/FFFFFF.png',
        title: 'Welcome to our store',
        subtitle: 'Discover amazing products',
        buttonText: 'Shop Now',
        buttonUrl: '/shop'
      }
    ]
  },
  colors: {
    primary: '#4E1DAC',
    secondary: '#1F2937',
    accent: '#F3F4F6',
    background: '#FFFFFF',
    text: '#1F2937'
  },
  typography: {
    headingFont: 'Inter',
    bodyFont: 'Inter',
    baseSize: '16px',
    scale: 1.2
  },
  layout: {
    maxWidth: '1280px',
    gutter: '1rem',
    containerPadding: '1rem'
  },
  header: {
    showTopBar: true,
    topBarBg: '#4E1DAC',
    topBarText: '#FFFFFF',
    menuType: 'default',
    menuBg: '#FFFFFF',
    menuText: '#1F2937',
    logo: '',
    navigation: {
      alignment: 'center',
      spacing: 'normal',
      fontSize: '16px',
      fontWeight: 'medium',
      items: [
        { text: 'Início', url: '/' },
        { text: 'Catálogo', url: '/catalog' },
        { text: 'Contato', url: '/contact' }
      ]
    },
    icons: {
      size: 'medium',
      color: '#1F2937',
      showLabels: false
    },
    sticky: false,
    borderBottom: true,
    borderColor: '#E5E7EB'
  },
  hero: {
    style: 'fullwidth',
    height: 'large',
    overlayOpacity: 0.4,
    contentAlignment: 'center',
    showGradient: true,
    gradientDirection: 'bottom',
    image: 'https://placehold.co/1920x1080/404040/FFFFFF.png',
    mobileImage: 'https://via.placeholder.com/800x1200',
    title: {
      text: 'Ofertas Especiais',
      color: '#FFFFFF',
      fontSize: '4xl',
      fontWeight: 'bold'
    },
    subtitle: {
      text: 'Aproveite nossos descontos exclusivos',
      color: '#FFFFFF',
      fontSize: 'xl',
      fontWeight: 'normal'
    },
    button: {
      show: true,
      text: 'Ver ofertas',
      url: '/offers',
      style: 'primary',
      size: 'large'
    },
    spacing: {
      top: '8',
      bottom: '8'
    }
  },
  collections: {
    layout: 'grid',
    itemsPerRow: 4,
    showTitle: true,
    showPrice: true,
    showDescription: false,
    backgroundColor: '#FFFFFF',
    textColor: '#1F2937',
  },
  dailyDeals: {
    enabled: true,
    title: 'Daily Deals',
    countdown: true,
    productsToShow: 4,
    backgroundColor: '#F3F4F6',
  },
  featuredCollection: {
    title: 'Featured Collection',
    collection: 'all',
    productsToShow: 4,
    layout: 'grid',
    backgroundColor: '#FFFFFF'
  },
  featuredProducts: {
    enabled: true,
    layout: {
      type: 'grid',
      columns: {
        desktop: 4,
        tablet: 2,
        mobile: 1
      },
      gap: 'medium'
    },
    header: {
      show: true,
      text: 'Produtos em Destaque',
      alignment: 'center',
      fontSize: 'xl',
      fontWeight: 'semibold',
      marginBottom: '8'
    },
    tabs: {
      show: true,
      items: [
        { id: 'launches', text: 'Lançamentos' },
        { id: 'bestsellers', text: 'Mais vendidos' }
      ],
      style: {
        type: 'pills',
        alignment: 'center',
        activeColor: '#000000',
        inactiveColor: '#6B7280',
        backgroundColor: '#F3F4F6'
      }
    },
    product: {
      image: {
        aspectRatio: '1/1',
        fit: 'cover',
        hover: {
          effect: 'zoom',
          opacity: 0.8
        }
      },
      title: {
        show: true,
        fontSize: 'sm',
        fontWeight: 'medium',
        color: '#1F2937',
        alignment: 'center'
      },
      price: {
        show: true,
        fontSize: 'sm',
        fontWeight: 'semibold',
        color: '#1F2937',
        alignment: 'center'
      },
      button: {
        show: true,
        text: 'Comprar',
        style: 'primary',
        size: 'medium'
      }
    },
    spacing: {
      top: '12',
      bottom: '12'
    },
    backgroundColor: '#FFFFFF'
  },
  separator: {
    style: 'line',
    color: '#E5E7EB',
    height: 1,
    showDivider: true,
  },
  instagramGallery: {
    enabled: true,
    title: 'Follow us on Instagram',
    username: '@yourstore',
    postsToShow: 6,
    layout: 'grid',
  },
  newsletter: {
    title: 'Fique por dentro das novidades',
    subtitle: 'Receba ofertas exclusivas e atualizações em seu email',
    buttonText: 'Inscrever-se',
    backgroundColor: '#F3F4F6',
    textColor: '#1F2937',
    layout: 'boxed'
  },
  footer: {
    columns: 4,
    backgroundColor: '#FFFFFF',
    textColor: '#1F2937',
    showSocial: true,
    copyrightText: '2024 Minha loja. Todos os direitos reservados.',
    links: [
      {
        title: 'Empresa',
        items: [
          { text: 'Sobre nós', url: '/about' },
          { text: 'Contato', url: '/contact' }
        ]
      }
    ],
    style: {
      backgroundColor: '#FFFFFF',
      borderTop: true,
      borderColor: '#E5E7EB'
    },
    sections: [
      {
        type: 'social',
        title: {
          text: 'Redes Sociais',
          color: '#1F2937',
          fontSize: 'sm',
          fontWeight: 'semibold'
        },
        links: [
          { platform: 'facebook', url: '#' },
          { platform: 'instagram', url: '#' },
          { platform: 'pinterest', url: '#' },
          { platform: 'linkedin', url: '#' }
        ],
        iconSize: 'medium',
        iconColor: '#4B5563',
        spacing: '6'
      },
      {
        type: 'links',
        title: {
          text: 'Novidades',
          color: '#1F2937',
          fontSize: 'sm',
          fontWeight: 'semibold'
        },
        links: [
          { text: 'Lançamentos', url: '#' },
          { text: 'Mais vendidos', url: '#' },
          { text: 'Promoções', url: '#' }
        ],
        linkStyle: {
          color: '#4B5563',
          hoverColor: '#1F2937',
          fontSize: 'base'
        }
      },
      {
        type: 'badges',
        title: {
          text: 'Segurança e qualidade',
          color: '#1F2937',
          fontSize: 'sm',
          fontWeight: 'semibold'
        },
        badges: [
          { image: 'https://placehold.co/60x30/404040/FFFFFF.png', alt: 'Security badge' },
          { image: 'https://placehold.co/60x30/404040/FFFFFF.png', alt: 'Quality badge' },
          { image: 'https://placehold.co/60x30/404040/FFFFFF.png', alt: 'SSL badge' }
        ],
        badgeSize: 'medium',
        spacing: '4'
      },
      {
        type: 'payment',
        title: {
          text: 'Formas de pagamento',
          color: '#1F2937',
          fontSize: 'sm',
          fontWeight: 'semibold'
        },
        methods: [
          { type: 'visa', image: '/assets/payment/visa.png', width: 60, height: 40 },
          { type: 'mastercard', image: '/assets/payment/mastercard.png', width: 60, height: 40 },
          { type: 'amex', image: '/assets/payment/amex.png', width: 60, height: 40 },
          { type: 'elo', image: '/assets/payment/elo.png', width: 60, height: 40 },
          { type: 'pix', image: '/assets/payment/pix.png', width: 60, height: 40 },
          { type: 'boleto', image: '/assets/payment/boleto.png', width: 60, height: 40 }
        ],
        methodSize: 'medium',
        spacing: '4'
      }
    ],
    copyright: {
      text: '2024 Minha loja. Todos os direitos reservados.',
      color: '#6B7280',
      fontSize: 'sm',
      alignment: 'center',
      marginTop: '8'
    }
  }
};



interface ThemeContextType {
  theme: ThemeSettings;
  updateTheme: (section: keyof ThemeSettings, settings: any) => Promise<void>;
  publishTheme: () => Promise<void>;
  previewTheme: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeSettings>(defaultTheme);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentTenant } = useTenant();

  const loadTheme = useCallback(async () => {
    if (!currentTenant?.id) return;

    try {
      setLoading(true);
      setError(null);

      // First check if the server is available
      const serverAvailable = await themeService.isServerAvailable();

      // Even if server is unavailable, getTheme will return the default theme
      const loadedTheme = await themeService.getTheme(currentTenant.id);
      setTheme(prev => ({ ...prev, ...loadedTheme }));

      // Only show an error message if the server is unavailable
      if (!serverAvailable) {
        setError('Theme server is currently unavailable. Using default theme.');
      }
    } catch (err) {
      console.error('Error loading theme:', err);
      setError('Failed to load theme settings. Using default theme.');
    } finally {
      setLoading(false);
    }
  }, [currentTenant?.id]);

  useEffect(() => {
    loadTheme();
  }, [loadTheme]);

  const updateTheme = useCallback(async (section: keyof ThemeSettings, settings: any) => {
    if (!currentTenant?.id) return;

    try {
      setError(null);
      const updatedTheme = {
        ...theme,
        [section]: {
          ...theme[section],
          ...settings,
        },
      };

      // Update local state immediately for better UX
      setTheme(updatedTheme);

      // Check server availability before attempting to save
      const serverAvailable = await themeService.isServerAvailable();
      if (!serverAvailable) {
        setError('Theme server is currently unavailable. Changes saved locally only.');
        return;
      }

      // Attempt to save to server
      await themeService.saveTheme(currentTenant.id, updatedTheme);
    } catch (err) {
      console.error('Error updating theme:', err);
      setError('Failed to save theme settings to server. Changes saved locally only.');
      // Don't throw error to prevent UI disruption
    }
  }, [theme, currentTenant?.id]);

  const publishTheme = useCallback(async () => {
    if (!currentTenant?.id) return;

    try {
      setError(null);

      // Check server availability before attempting to publish
      const serverAvailable = await themeService.isServerAvailable();
      if (!serverAvailable) {
        setError('Theme server is currently unavailable. Unable to publish theme.');
        return;
      }

      await themeService.publishTheme(currentTenant.id);
    } catch (err) {
      console.error('Error publishing theme:', err);
      setError('Failed to publish theme. Please try again later.');
      // Don't throw error to prevent UI disruption
    }
  }, [currentTenant?.id]);

  const previewTheme = useCallback(async () => {
    if (!currentTenant?.id) return;

    try {
      setError(null);

      // Check server availability before attempting to preview
      const serverAvailable = await themeService.isServerAvailable();
      if (!serverAvailable) {
        setError('Theme server is currently unavailable. Unable to preview theme.');
        return;
      }

      await themeService.previewTheme(currentTenant.id, theme);
    } catch (err) {
      console.error('Error previewing theme:', err);
      setError('Failed to preview theme. Please try again later.');
      // Don't throw error to prevent UI disruption
    }
  }, [currentTenant?.id, theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        updateTheme,
        publishTheme,
        previewTheme,
        loading,
        error
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};