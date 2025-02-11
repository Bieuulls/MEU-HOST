export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  stock: number;
  sku: string | null;
  attributes: Record<string, string>;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  sku: string | null;
  active: boolean;
  images: string[];
  category: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
  featured: boolean;
  discount: number;
  rating: number;
  reviews_count: number;
  specifications: Record<string, string>;
  variants: ProductVariant[];
  tags: string[];
  brand: string | null;
  weight: number | null;
  dimensions: {
    length: number;
    width: number;
    height: number;
  } | null;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  } | null;
  metadata: Record<string, any>;
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stock: number;
  sku: string;
  active: boolean;
  images: string[];
  category: string;
  featured: boolean;
  discount: number;
  specifications: Record<string, string>;
  variants: ProductVariant[];
  tags: string[];
  brand: string;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  metadata: Record<string, any>;
}