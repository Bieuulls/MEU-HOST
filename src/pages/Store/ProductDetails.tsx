import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Heart, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Product, ProductVariant } from '../../types/database';
import { ProductSpecifications } from '../../components/store/ProductSpecifications';
import { ProductVariants } from '../../components/store/ProductVariants';
import { Header } from '../../components/store/Header';
import { Footer } from '../../components/store/Footer';
import { ImageWithFallback } from '../../components/common/ImageWithFallback';

export function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [cartCount] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [id]);

  async function loadProduct() {
    try {
      if (!id) return;

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  }

  const handlePrevImage = () => {
    if (!product?.images.length) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    if (!product?.images.length) return;
    setCurrentImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleAddToCart = () => {
    // Implementar lógica do carrinho
    console.log('Adding to cart:', {
      product,
      variant: selectedVariant,
      quantity
    });
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleShare = async () => {
    if (!product) return;
    
    try {
      await navigator.share({
        title: product.name,
        text: product.description || product.name,
        url: window.location.href
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header cartCount={cartCount} onSearch={() => {}} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="h-24 bg-gray-200 rounded mb-8"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header cartCount={cartCount} onSearch={() => {}} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Produto não encontrado
            </h1>
            <p className="text-gray-500">
              O produto que você está procurando não existe ou foi removido.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const currentPrice = selectedVariant?.price || product.price;
  const finalPrice =
    product.discount > 0
      ? (currentPrice * (100 - product.discount)) / 100
      : currentPrice;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartCount={cartCount} onSearch={() => {}} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
          {/* Image Gallery */}
          <div className="relative">
            <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden">
              <ImageWithFallback
                src={product.images[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-center object-cover"
              />
            </div>

            {/* Image Navigation */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white shadow-md hover:bg-gray-100"
                >
                  <ChevronLeft className="h-6 w-6 text-gray-600" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white shadow-md hover:bg-gray-100"
                >
                  <ChevronRight className="h-6 w-6 text-gray-600" />
                </button>
              </>
            )}

            {/* Thumbnail Grid */}
            {product.images.length > 1 && (
              <div className="mt-4 grid grid-cols-6 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative aspect-w-1 aspect-h-1 rounded-md overflow-hidden ${
                      currentImageIndex === index
                        ? 'ring-2 ring-blue-500'
                        : 'hover:opacity-75'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} - ${index + 1}`}
                      className="w-full h-full object-center object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="mt-8 lg:mt-0">
            {/* Category */}
            {product.category && (
              <div className="text-sm text-gray-500 mb-2">{product.category}</div>
            )}

            {/* Name */}
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

            {/* Rating */}
            {product.rating && (
              <div className="mt-2 flex items-center">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className={`h-5 w-5 ${
                        index < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-500">
                  {product.reviews_count} avaliações
                </span>
              </div>
            )}

            {/* Price */}
            <div className="mt-4">
              {product.discount > 0 ? (
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900">
                    R$ {finalPrice.toFixed(2)}
                  </span>
                  <span className="ml-2 text-lg text-gray-500 line-through">
                    R$ {currentPrice.toFixed(2)}
                  </span>
                  <span className="ml-2 text-sm font-medium text-red-500">
                    -{product.discount}%
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-bold text-gray-900">
                  R$ {finalPrice.toFixed(2)}
                </span>
              )}

              {/* Installments */}
              <p className="mt-1 text-sm text-gray-500">
                em até 12x de R$ {(finalPrice / 12).toFixed(2)}
              </p>
            </div>

            {/* Description */}
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Descrição
              </h3>
              <div className="prose prose-sm text-gray-500">
                {product.description}
              </div>
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <ProductVariants
                variants={product.variants}
                onVariantSelect={setSelectedVariant}
              />
            )}

            {/* Quantity */}
            <div className="mt-6">
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                Quantidade
              </label>
              <select
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                {Array.from({ length: 10 }).map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div className="mt-8 flex gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Adicionar ao Carrinho
              </button>
              <button
                onClick={handleToggleFavorite}
                className="p-3 rounded-md border border-gray-300 hover:bg-gray-50"
              >
                <Heart
                  className={`h-6 w-6 ${
                    isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
                  }`}
                />
              </button>
              <button
                onClick={handleShare}
                className="p-3 rounded-md border border-gray-300 hover:bg-gray-50"
              >
                <Share2 className="h-6 w-6 text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Specifications */}
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div className="mt-16">
            <ProductSpecifications specifications={product.specifications} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
