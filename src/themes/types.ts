export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: {
    primary: string;
    secondary: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
}

export interface ThemeTypography {
  fonts: {
    heading: string;
    body: string;
  };
  scale: {
    base: string;
    ratio: number;
  };
  h1: {
    fontSize: string;
    lineHeight: string;
    fontWeight: string;
  };
  h2: {
    fontSize: string;
    lineHeight: string;
    fontWeight: string;
  };
  h3: {
    fontSize: string;
    lineHeight: string;
    fontWeight: string;
  };
  h4: {
    fontSize: string;
    lineHeight: string;
    fontWeight: string;
  };
  h5: {
    fontSize: string;
    lineHeight: string;
    fontWeight: string;
  };
  h6: {
    fontSize: string;
    lineHeight: string;
    fontWeight: string;
  };
  body: {
    fontSize: string;
    lineHeight: string;
    fontWeight: string;
  };
  small: {
    fontSize: string;
    lineHeight: string;
    fontWeight: string;
  };
}

export interface ResponsiveMenu {
  type: "hamburger" | "sidebar" | "mega" | "dropdown";
  position: "top" | "side" | "bottom";
  backgroundColor: string;
  textColor: string;
  hoverColor: string;
  showIcons: boolean;
  iconSize: string;
  padding: string;
}

export interface ThemeLayout {
  breakpoints: {
    mobile: string;
    tablet: string;
    desktop: string;
    wide: string;
    md: string;
  };
  header: {
    height: string;
    sticky: boolean;
    topBar: {
      show: boolean;
      text: string;
      backgroundColor: string;
      textColor: string;
    };
  };
  menu: {
    desktop: ResponsiveMenu;
    tablet: ResponsiveMenu;
    mobile: ResponsiveMenu;
  };
  banner: {
    style: "full" | "contained" | "carousel";
    height: {
      desktop: string;
      tablet: string;
      mobile: string;
    };
    items: Array<{
      id: number;
      title: string;
      description: string;
      image: string;
      buttonText: string;
      buttonLink: string;
    }>;
  };
  cards: {
    borderRadius: string;
    border: string;
    shadow: string;
    padding: {
      desktop: string;
      tablet: string;
      mobile: string;
    };
  };
  productGrid: {
    columns: {
      desktop: number;
      tablet: number;
      mobile: number;
    };
    gap: {
      desktop: string;
      tablet: string;
      mobile: string;
    };
    aspectRatio: string;
  };
  buttons: {
    borderRadius: string;
    padding: {
      small: string;
      medium: string;
      large: string;
    };
  };
  notices: {
    shipping: {
      show: boolean;
      text: string;
      backgroundColor: string;
      textColor: string;
    };
    security: {
      show: boolean;
      text: string;
      backgroundColor: string;
      textColor: string;
    };
  };
}

export interface ThemeSpacing {
  container: {
    maxWidth: string;
    padding: {
      desktop: string;
      tablet: string;
      mobile: string;
    };
  };
  section: {
    padding: {
      desktop: string;
      tablet: string;
      mobile: string;
    };
    margin: {
      desktop: string;
      tablet: string;
      mobile: string;
    };
  };
}

export interface ThemeEffects {
  transition: {
    duration: string;
    timing: string;
  };
  shadow: {
    small: string;
    medium: string;
    large: string;
  };
}

export interface Theme {
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  layout: ThemeLayout;
  effects: ThemeEffects;
}
