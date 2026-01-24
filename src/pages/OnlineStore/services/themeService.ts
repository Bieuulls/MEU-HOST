import { Theme } from '../types';

export const themeService = {
  async uploadTheme(file: File): Promise<Theme> {
    const formData = new FormData();
    formData.append('theme', file);

    try {
      const response = await fetch('/api/themes/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload theme');
      }

      return response.json();
    } catch (error) {
      throw new Error('Theme upload failed. Please try again.');
    }
  },
};
