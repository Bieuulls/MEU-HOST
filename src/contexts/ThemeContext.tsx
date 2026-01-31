import { createContext, useContext, useState, ReactNode } from 'react';
import { ThemeSettings } from '../types';

export interface ThemeContextType {
    theme: ThemeSettings;
    currentTheme: ThemeSettings;
    updateTheme: (data: Partial<ThemeSettings>) => void;
    saveTheme: () => Promise<void>;
    publishTheme: () => Promise<void>;
    previewTheme: () => Promise<void>;
    resetTheme: () => void;
    isServerAvailable: boolean;
}

export const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

// Mock ThemeProvider implementation
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState<ThemeSettings>({} as ThemeSettings); // Initialize with default or empty
    const [isServerAvailable] = useState(false);

    const updateTheme = (data: Partial<ThemeSettings>) => {
        setTheme(prev => ({ ...prev, ...data }));
    };

    const saveTheme = async () => {};
    const publishTheme = async () => {};
    const previewTheme = async () => {};
    const resetTheme = () => {};

    const value = {
        theme,
        currentTheme: theme,
        updateTheme,
        saveTheme,
        publishTheme,
        previewTheme,
        resetTheme,
        isServerAvailable
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};
