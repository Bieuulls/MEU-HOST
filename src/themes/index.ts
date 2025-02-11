import { Theme } from './types';
import { minimal } from './minimal';

// Collection of all available themes
export const themes: Record<string, Theme> = {
  minimal: minimal,
  // Add more themes here
};

// Function to get a theme by ID
export function getThemeById(themeId: string): Theme | undefined {
  return themes[themeId];
}

export { minimal };
