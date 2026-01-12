import axios, { AxiosError } from 'axios';
import { ThemeSettings } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // 1 second

const DEFAULT_THEME: ThemeSettings = {
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
        image: '/images/default-hero.jpg',
        title: 'Welcome to our store',
        subtitle: 'Discover amazing products',
        buttonText: 'Shop Now',
        buttonUrl: '/shop'
      }
    ]
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
        { text: 'Home', url: '/' },
        { text: 'Catalog', url: '/catalog' },
        { text: 'Contact', url: '/contact' }
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
    image: '/images/default-hero.jpg',
    mobileImage: '/images/default-hero-mobile.jpg',
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
  featuredCollection: {
    title: 'Featured Collection',
    collection: 'featured',
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
  newsletter: {
    enabled: true,
    title: {
      text: 'Fique por dentro das novidades',
      color: '#1F2937',
      fontSize: 'xl',
      fontWeight: 'semibold',
      marginBottom: '4'
    },
    subtitle: {
      text: 'Receba ofertas exclusivas e atualizações em seu email',
      color: '#6B7280',
      fontSize: 'base',
      fontWeight: 'normal',
      marginBottom: '6'
    },
    input: {
      placeholder: 'Seu melhor email',
      backgroundColor: '#FFFFFF',
      textColor: '#1F2937',
      borderColor: '#E5E7EB'
    },
    button: {
      text: 'Inscrever-se',
      backgroundColor: '#3B82F6',
      textColor: '#FFFFFF'
    },
    background: {
      type: 'solid',
      color: '#F3F4F6',
      gradient: {
        from: '#F3F4F6',
        to: '#E5E7EB',
        direction: 'bottom'
      }
    },
    layout: {
      type: 'boxed',
      padding: {
        top: 12,
        bottom: 12
      }
    }
  }
};

// Add server status tracking
let isServerAvailable = true;
let lastServerCheck = 0;
const SERVER_CHECK_INTERVAL = 30000; // 30 seconds

// Helper function to check if the server is available
async function checkServerAvailability(): Promise<boolean> {
  try {
    // Only check server status periodically to avoid excessive requests
    const now = Date.now();
    if (now - lastServerCheck < SERVER_CHECK_INTERVAL) {
      return isServerAvailable;
    }

    lastServerCheck = now;
    await axios.get(`${API_URL}/health`, { timeout: 2000 });
    isServerAvailable = true;
    return true;
  } catch (error) {
    isServerAvailable = false;
    return false;
  }
}

// Helper function to implement retry logic
async function retryableRequest<T>(requestFn: () => Promise<T>, retries = MAX_RETRIES): Promise<T> {
  try {
    // If we know the server is down, don't even try
    if (!isServerAvailable && Date.now() - lastServerCheck < SERVER_CHECK_INTERVAL) {
      throw new Error('Server is currently unavailable');
    }

    return await requestFn();
  } catch (error) {
    if (retries <= 0) throw error;

    // Wait before retrying
    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    return retryableRequest(requestFn, retries - 1);
  }
}

export const themeService = {
  async getTheme(tenantId: string): Promise<ThemeSettings> {
    if (!tenantId) throw new Error('Tenant ID is required');

    try {
      // Check server availability first
      const serverAvailable = await checkServerAvailability();
      if (!serverAvailable) {
        console.warn('Theme server is unavailable, using default theme');
        return DEFAULT_THEME;
      }

      const response = await retryableRequest(() =>
        axios.get<Partial<ThemeSettings>>(`${API_URL}/themes/${tenantId}`)
      );

      return { ...DEFAULT_THEME, ...response.data };
    } catch (error) {
      const axiosError = error as AxiosError;
      console.warn(`Failed to load theme from server (${axiosError.message}), using default theme`);
      return DEFAULT_THEME;
    }
  },

  async saveTheme(tenantId: string, theme: ThemeSettings): Promise<void> {
    if (!tenantId) throw new Error('Tenant ID is required');
    if (!theme) throw new Error('Theme settings are required');

    try {
      // Check server availability first
      const serverAvailable = await checkServerAvailability();
      if (!serverAvailable) {
        throw new Error('Theme server is currently unavailable');
      }

      await retryableRequest(() =>
        axios.put(`${API_URL}/themes/${tenantId}`, theme)
      );
    } catch (error) {
      const axiosError = error as AxiosError;
      throw new Error(`Failed to save theme: ${axiosError.message}`);
    }
  },

  async publishTheme(tenantId: string): Promise<void> {
    if (!tenantId) throw new Error('Tenant ID is required');

    try {
      // Check server availability first
      const serverAvailable = await checkServerAvailability();
      if (!serverAvailable) {
        throw new Error('Theme server is currently unavailable');
      }

      await retryableRequest(() =>
        axios.post(`${API_URL}/themes/${tenantId}/publish`)
      );
    } catch (error) {
      const axiosError = error as AxiosError;
      throw new Error(`Failed to publish theme: ${axiosError.message}`);
    }
  },

  async previewTheme(tenantId: string, theme: ThemeSettings): Promise<void> {
    if (!tenantId) throw new Error('Tenant ID is required');
    if (!theme) throw new Error('Theme settings are required');

    try {
      // Check server availability first
      const serverAvailable = await checkServerAvailability();
      if (!serverAvailable) {
        throw new Error('Theme server is currently unavailable');
      }

      await retryableRequest(() =>
        axios.post(`${API_URL}/themes/${tenantId}/preview`, theme)
      );
    } catch (error) {
      const axiosError = error as AxiosError;
      throw new Error(`Failed to preview theme: ${axiosError.message}`);
    }
  },

  // Add a method to check server status
  async isServerAvailable(): Promise<boolean> {
    return await checkServerAvailability();
  }
};