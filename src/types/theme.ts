export interface ThemeStyles {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
    success: string;
    error: string;
    warning: string;
    surface: string;
    'surface-hover': string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    baseSize: string;
    scale: string;
    h1: { size: string; weight: string; lineHeight: string };
    h2: { size: string; weight: string; lineHeight: string };
    h3: { size: string; weight: string; lineHeight: string };
    body: { size: string; weight: string; lineHeight: string };
    small: { size: string; weight: string; lineHeight: string };
  };
  layout: {
    containerWidth: string;
    spacing: string;
    borderRadius: string;
    headerHeight: string;
    sidebarWidth: string;
    gridColumns: string;
    gridGap: string;
  };
  components: {
    button: {
      padding: string;
      borderRadius: string;
      fontSize: string;
      fontWeight: string;
    };
    input: {
      padding: string;
      borderRadius: string;
      borderColor: string;
      focusColor: string;
    };
    card: {
      padding: string;
      borderRadius: string;
      shadow: string;
    };
  };
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
  animations: {
    duration: string;
    easing: string;
  };
}

export interface Theme {
  id: string;
  name: string;
  styles: ThemeStyles;
  user_id: string;
  created_at: string;
  updated_at: string;
}