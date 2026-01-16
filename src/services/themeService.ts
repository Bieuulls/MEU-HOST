// Mock theme service
import { ThemeSettings } from '../types/theme'; // Adjust path if needed or redefine

export const themeService = {
    getThemes: async () => [],
    getTheme: async (id: string) => null,
    updateTheme: async (id: string, data: any) => null,
    uploadTheme: async (file: File) => null,
};
