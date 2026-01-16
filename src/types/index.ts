import { ThemeStyles } from './theme';

export interface ThemeSettings {
    hero?: any;
    header?: any;
    menu?: any;
    carousel?: any;
    featuredProducts?: any;
    collections?: any;
    footer?: any;
    newsletter?: any;
    spacing?: any;
    colors: ThemeStyles['colors'];
    typography: ThemeStyles['typography'];
    layout: ThemeStyles['layout'];
    components?: ThemeStyles['components'];
    breakpoints?: ThemeStyles['breakpoints'];
    animations?: ThemeStyles['animations'];
}

export interface User {
    id: string;
    email: string;
    name?: string; // Added name property
    role?: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

export interface Theme {
    id: string;
    name: string;
    styles: ThemeStyles;
    user_id: string;
    created_at: string;
    updated_at: string;
}

export interface UploadProgress {
    progress: number;
    fileName: string;
}

export type Product = import('./database').Product;

export interface CartItem extends Product {
    quantity: number;
}
