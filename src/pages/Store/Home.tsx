import { useState } from 'react';
import { FeaturedProducts } from '../../components/store/FeaturedProducts';
import { Categories } from '../../components/store/Categories';
import { useCart } from '../../contexts/CartContext';
import { Product } from '../../types/database';

// Temporary mock data - replace with real data from your database
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Smartphone XYZ',
    description: 'Um smartphone incrível com recursos avançados',
    price: 1999.99,
    images: ['/product-1.jpg'],
    category: 'electronics',
    stock: 10,
    sku: null,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: '1',
    featured: true,
    discount: 0,
    rating: 4.5,
    reviews_count: 0,
    specifications: {},
    variants: [],
    tags: [],
    brand: null,
    weight: null,
    dimensions: null
  },
  {
    id: '2',
    name: 'Notebook Pro',
    description: 'Notebook potente para todas as suas necessidades',
    price: 4499.99,
    images: ['/product-2.jpg'],
    category: 'computers',
    stock: 5,
    sku: null,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: '1',
    featured: true,
    discount: 0,
    rating: 4.5,
    reviews_count: 0,
    specifications: {},
    variants: [],
    tags: [],
    brand: null,
    weight: null,
    dimensions: null
  }
];

export function Home() {
  const { addItem } = useCart();
  const [favorites] = useState(new Set<string>());

  const handleAddToCart = (productId: string) => {
    const product = mockProducts.find(p => p.id === productId);
    if (product) {
      addItem({ product, quantity: 1 });
    }
  };

  const handleToggleFavorite = (product: Product) => {
    // Implement favorite toggle logic
  };

  return (
    <div className="space-y-12">
      <Categories />
      <FeaturedProducts
        products={mockProducts}
        onAddToCart={handleAddToCart}
        onToggleFavorite={handleToggleFavorite}
        favorites={favorites}
      />
    </div>
  );
}
