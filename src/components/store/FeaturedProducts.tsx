import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../../types/database';
import { ProductCard } from './ProductCard';

interface FeaturedProductsProps {
  products: Product[];
  onAddToCart: (productId: string) => void;
  onToggleFavorite: (product: Product) => void;
  favorites: Set<string>;
}

export function FeaturedProducts({ 
  products,
  onAddToCart,
  onToggleFavorite,
  favorites
}: FeaturedProductsProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const productsPerSlide = 4;
  const totalSlides = Math.ceil(products.length / productsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <div className="relative">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Produtos em Destaque</h2>

      {/* Navigation Buttons */}
      {totalSlides > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute -left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 z-10"
          >
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute -right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 z-10"
          >
            <ChevronRight className="h-6 w-6 text-gray-600" />
          </button>
        </>
      )}

      {/* Products Grid */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
          }}
        >
          {Array.from({ length: totalSlides }).map((_, slideIndex) => (
            <div
              key={slideIndex}
              className="flex-shrink-0 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {products
                .slice(
                  slideIndex * productsPerSlide,
                  (slideIndex + 1) * productsPerSlide
                )
                .map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={() => onAddToCart(product.id)}
                    onToggleFavorite={() => onToggleFavorite(product)}
                    isFavorite={favorites.has(product.id)}
                  />
                ))}
            </div>
          ))}
        </div>
      </div>

      {/* Slide Indicators */}
      {totalSlides > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${
                currentSlide === index ? 'w-4 bg-blue-600' : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
