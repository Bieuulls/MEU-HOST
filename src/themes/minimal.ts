import { Theme } from './types';

export const minimal: Theme = {
  colors: {
    primary: "#0070f3",
    secondary: "#7928ca",
    accent: "#f5a623",
    background: {
      primary: "#ffffff",
      secondary: "#f7f7f7"
    },
    text: {
      primary: "#111827",
      secondary: "#4b5563",
      tertiary: "#9ca3af"
    }
  },
  typography: {
    fonts: {
      heading: "'Inter', sans-serif",
      body: "'Inter', sans-serif"
    },
    scale: {
      base: "16px",
      ratio: 1.2
    },
    h1: {
      fontSize: "2.488rem",
      lineHeight: "1.2",
      fontWeight: "700"
    },
    h2: {
      fontSize: "2.074rem",
      lineHeight: "1.2",
      fontWeight: "600"
    },
    h3: {
      fontSize: "1.728rem",
      lineHeight: "1.3",
      fontWeight: "600"
    },
    h4: {
      fontSize: "1.44rem",
      lineHeight: "1.4",
      fontWeight: "600"
    },
    h5: {
      fontSize: "1.2rem",
      lineHeight: "1.4",
      fontWeight: "600"
    },
    h6: {
      fontSize: "1rem",
      lineHeight: "1.4",
      fontWeight: "600"
    },
    body: {
      fontSize: "1rem",
      lineHeight: "1.5",
      fontWeight: "400"
    },
    small: {
      fontSize: "0.833rem",
      lineHeight: "1.5",
      fontWeight: "400"
    }
  },
  spacing: {
    container: {
      maxWidth: "1280px",
      padding: {
        desktop: "2rem",
        tablet: "1.5rem",
        mobile: "1rem"
      }
    },
    section: {
      padding: {
        desktop: "4rem",
        tablet: "3rem",
        mobile: "2rem"
      },
      margin: {
        desktop: "4rem",
        tablet: "3rem",
        mobile: "2rem"
      }
    }
  },
  layout: {
    breakpoints: {
      mobile: "480px",
      tablet: "768px",
      desktop: "1024px",
      wide: "1280px",
      md: "768px"
    },
    header: {
      height: "64px",
      sticky: true,
      topBar: {
        show: true,
        text: "Frete grátis para todo o Brasil!",
        backgroundColor: "#000000",
        textColor: "#ffffff"
      }
    },
    menu: {
      desktop: {
        type: "mega",
        position: "top",
        backgroundColor: "#ffffff",
        textColor: "#000000",
        hoverColor: "#0070f3",
        showIcons: true,
        iconSize: "1.5rem",
        padding: "1rem"
      },
      tablet: {
        type: "dropdown",
        position: "top",
        backgroundColor: "#ffffff",
        textColor: "#000000",
        hoverColor: "#0070f3",
        showIcons: true,
        iconSize: "1.25rem",
        padding: "0.75rem"
      },
      mobile: {
        type: "hamburger",
        position: "top",
        backgroundColor: "#ffffff",
        textColor: "#000000",
        hoverColor: "#0070f3",
        showIcons: true,
        iconSize: "1rem",
        padding: "0.5rem"
      }
    },
    banner: {
      style: "carousel" as const,
      height: {
        desktop: "500px",
        tablet: "400px",
        mobile: "300px"
      },
      items: [
        {
          id: 1,
          title: "Promoção de Verão",
          description: "Até 50% de desconto em produtos selecionados",
          image: "/images/banner1.jpg",
          buttonText: "Comprar Agora",
          buttonLink: "/promocoes"
        },
        {
          id: 2,
          title: "Nova Coleção",
          description: "Confira as últimas tendências",
          image: "/images/banner2.jpg",
          buttonText: "Ver Mais",
          buttonLink: "/colecao"
        }
      ]
    },
    cards: {
      borderRadius: "8px",
      border: "1px solid #eaeaea",
      shadow: "0 2px 4px rgba(0,0,0,0.1)",
      padding: {
        desktop: "1.5rem",
        tablet: "1.25rem",
        mobile: "1rem"
      }
    },
    productGrid: {
      columns: {
        desktop: 4,
        tablet: 3,
        mobile: 2
      },
      gap: {
        desktop: "2rem",
        tablet: "1.5rem",
        mobile: "1rem"
      },
      aspectRatio: "3/4"
    },
    buttons: {
      borderRadius: "4px",
      padding: {
        small: "0.5rem 1rem",
        medium: "0.75rem 1.5rem",
        large: "1rem 2rem"
      }
    },
    notices: {
      shipping: {
        show: true,
        text: "Frete grátis para todo o Brasil!",
        backgroundColor: "#000000",
        textColor: "#ffffff"
      },
      security: {
        show: true,
        text: "Site 100% seguro. Compre com tranquilidade.",
        backgroundColor: "#f3f4f6",
        textColor: "#111827"
      }
    }
  },
  effects: {
    transition: {
      duration: "0.2s",
      timing: "ease-in-out"
    },
    shadow: {
      small: "0 2px 4px rgba(0,0,0,0.1)",
      medium: "0 4px 8px rgba(0,0,0,0.1)",
      large: "0 8px 16px rgba(0,0,0,0.1)"
    }
  }
};
