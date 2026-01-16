// Mock frontend services

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

export const productService = {
    getProducts: async () => [],
    getProduct: async (id: string) => null,
    createProduct: async (data: any) => null,
    updateProduct: async (id: string, data: any) => null,
    deleteProduct: async (id: string) => null,
};
