// Auth Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'customer';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

// Product Types
export interface Product {
  id: string | number;
  tenant_id?: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  sku?: string;
  barcode?: string;
  weight?: number;
  status?: 'active' | 'draft' | 'archived';
  is_featured?: boolean;
  image?: string;
  image_url?: string; // from db
  category?: string;
  created_at?: string;
  updated_at?: string;
}

// Order Types
export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
}

// Theme Types
export interface ThemeSettings {
  header: {
    showTopBar: boolean;
    topBarBg: string;
    topBarText: string;
    menuType: 'default' | 'mega_menu' | 'simple';
    menuBg: string;
    menuText: string;
    logo: string;
    navigation: {
      alignment: string;
      spacing: string;
      fontSize: string;
      fontWeight: string;
      items: Array<{
        text: string;
        url: string;
      }>;
    };
    icons: {
      size: string;
      color: string;
      showLabels: boolean;
    };
    sticky: boolean;
    borderBottom: boolean;
    borderColor: string;
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    baseSize: string;
    scale: number;
  };
  layout: {
    maxWidth: string;
    gutter: string;
    containerPadding: string;
  };
  carousel: {
    showControls: boolean;
    showIndicators: boolean;
    backgroundColor: string;
    useGradient: boolean;
    fullWidth: boolean;
    autoplay: boolean;
    autoplayTime: number;
    showProgressBar: boolean;
    transition: 'slide' | 'fade';
    transitionSpeed: 'slow' | 'normal' | 'fast';
    slides: Array<{
      image: string;
      title: string;
      subtitle: string;
      buttonText: string;
      buttonUrl: string;
    }>;
  };
  collections: {
    layout: 'grid' | 'carousel';
    itemsPerRow: number;
    showTitle: boolean;
    showPrice: boolean;
    showDescription: boolean;
    backgroundColor: string;
    textColor: string;
  };
  dailyDeals: {
    enabled: boolean;
    title: string;
    countdown: boolean;
    productsToShow: number;
    backgroundColor: string;
  };
  featuredCollection: {
    title: string;
    collection: string;
    productsToShow: number;
    layout: 'grid' | 'slider';
    backgroundColor: string;
  };
  separator: {
    style: 'line' | 'space' | 'wave';
    color: string;
    height: number;
    showDivider: boolean;
  };
  instagramGallery: {
    enabled: boolean;
    title: string;
    username: string;
    postsToShow: number;
    layout: 'grid' | 'carousel';
  };
  newsletter: {
    title: string;
    subtitle: string;
    buttonText: string;
    backgroundColor: string;
    textColor: string;
    layout: 'boxed' | 'full_width';
  };
  footer: {
    columns: number;
    backgroundColor: string;
    textColor: string;
    style?: {
      backgroundColor: string;
      borderTop: boolean;
      borderColor: string;
    };
    showSocial: boolean;
    copyrightText: string;
    links: Array<{
      title: string;
      items: Array<{
        text: string;
        url: string;
      }>;
    }>;
    sections: Array<{
      type: string;
      title?: {
        text: string;
        color: string;
        fontSize: string;
        fontWeight: string;
      };
      links?: Array<{
        platform?: string;
        text?: string;
        url: string;
      }>;
      linkStyle?: {
        color: string;
        hoverColor: string;
        fontSize: string;
      };
      iconSize?: string;
      iconColor?: string;
      spacing?: string;
      badges?: Array<{
        image: string;
        alt: string;
      }>;
      badgeSize?: string;
      methods?: Array<{
        type: string;
        image: string;
        width: number;
        height: number;
      }>;
      methodSize?: string;
    }>;
    copyright: {
      text: string;
      color: string;
      fontSize: string;
      alignment: string;
      marginTop: string;
    };
  };
}
