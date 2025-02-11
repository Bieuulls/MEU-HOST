import { ThemeStyles } from '../types/theme';

export function applyTheme(theme: ThemeStyles) {
  const root = document.documentElement;
  
  // Colors
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });
  
  // Typography
  root.style.setProperty('--font-heading', theme.typography.headingFont);
  root.style.setProperty('--font-body', theme.typography.bodyFont);
  root.style.setProperty('--font-base-size', theme.typography.baseSize);
  root.style.setProperty('--font-scale', theme.typography.scale);
  
  // Heading Styles
  Object.entries(theme.typography).forEach(([key, value]) => {
    if (typeof value === 'object') {
      root.style.setProperty(`--font-${key}-size`, value.size);
      root.style.setProperty(`--font-${key}-weight`, value.weight);
      root.style.setProperty(`--font-${key}-line-height`, value.lineHeight);
    }
  });
  
  // Layout
  Object.entries(theme.layout).forEach(([key, value]) => {
    root.style.setProperty(`--layout-${key}`, value);
  });
  
  // Components
  Object.entries(theme.components).forEach(([component, styles]) => {
    Object.entries(styles).forEach(([property, value]) => {
      root.style.setProperty(`--${component}-${property}`, value);
    });
  });
  
  // Breakpoints
  Object.entries(theme.breakpoints).forEach(([key, value]) => {
    root.style.setProperty(`--breakpoint-${key}`, value);
  });
  
  // Animations
  Object.entries(theme.animations).forEach(([key, value]) => {
    root.style.setProperty(`--animation-${key}`, value);
  });
}