import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Product } from '../../types/database';
import { ImageWithFallback } from '../common/ImageWithFallback';
import { formatCurrency } from '../../utils/format';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onToggleFavorite?: (productId: string) => void;
  isFavorite?: boolean;
}

export function ProductCard({ 
  product, 
  onAddToCart,
  onToggleFavorite,
  isFavorite = false 
}: ProductCardProps) {
  const discountedPrice = product.discount 
    ? product.price * (1 - product.discount / 100)
    : product.price;

  return (
    <div className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      {/* Favorite Button */}
      {onToggleFavorite && (
        <button
          onClick={() => onToggleFavorite(product.id)}
          className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
        >
          <Heart 
            className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
          />
        </button>
      )}

      {/* Product Image */}
      <Link to={`/store/products/${product.id}`} className="block aspect-square overflow-hidden rounded-t-lg">
        <ImageWithFallback
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <Link 
          to={`/store/products/${product.id}`}
          className="block text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-2"
        >
          {product.name}
        </Link>

        {/* Price */}
        <div className="mb-4">
          {product.discount > 0 ? (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-900">
                  {formatCurrency(discountedPrice)}
                </span>
                <span className="text-sm text-green-600 font-medium">
                  -{product.discount}%
                </span>
              </div>
              <span className="text-sm text-gray-500 line-through">
                {formatCurrency(product.price)}
              </span>
            </div>
          ) : (
            <span className="text-lg font-bold text-gray-900">
              {formatCurrency(product.price)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        {onAddToCart && (
          <button
            onClick={() => onAddToCart(product)}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Adicionar ao Carrinho
          </button>
        )}
      </div>
    </div>
  );
}
