// Mock types

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    sku?: string;
    barcode?: string;
    weight?: number;
    status: 'active' | 'draft' | 'archived';
    tenant_id: string;
    is_featured: boolean;
    image_url?: string;
    images?: string[];
    created_at?: string;
    updated_at?: string;
    category?: string;
    active?: boolean;
    user_id?: string;
    featured?: boolean;
    seo?: any;
    metadata?: any;
    dimensions?: any;
}

export interface Address {
    // Define address properties
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
}

export interface ProductVariant {
    // Define variant properties
    id: string;
    name: string;
    price: number;
}
