import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Newsletter } from '../components/Newsletter';
import { Collection } from '../components/Collection';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  discount?: number;
  rating?: number;
  reviewCount?: number;
  stock: number;
  sku?: string;
  categories?: string[];
  variants?: {
    name: string;
    options: string[];
  }[];
}

export const ProductPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock related products
  const relatedProducts = [
    {
      id: "5",
      title: "Related Product 1",
      price: 79.99,
      originalPrice: 99.99,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
      discount: 20,
      rating: 4.5,
      reviewCount: 18
    },
    {
      id: "6",
      title: "Related Product 2",
      price: 89.99,
      originalPrice: 109.99,
      image: "https://images.unsplash.com/photo-1560343090-f0409e92791a",
      discount: 15,
      rating: 4.2,
      reviewCount: 12
    },
    {
      id: "7",
      title: "Related Product 3",
      price: 69.99,
      originalPrice: 89.99,
      image: "https://images.unsplash.com/photo-1564466809058-bf4114d55352",
      discount: 22,
      rating: 4.7,
      reviewCount: 24
    },
    {
      id: "8",
      title: "Related Product 4",
      price: 59.99,
      originalPrice: 79.99,
      image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f",
      discount: 25,
      rating: 4.1,
      reviewCount: 16
    }
  ];

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        // For now, we'll simulate a product fetch with mock data
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

        // Mock product data
        const mockProduct: Product = {
          id: productId || '1',
          title: 'Premium Leather Wallet',
          description: 'This premium leather wallet is handcrafted with the finest materials. Features multiple card slots, a bill compartment, and RFID protection. Perfect for everyday use or as a gift.',
          price: 99.99,
          originalPrice: 129.99,
          stock: 25,
          sku: 'WALLET-001',
          categories: ['Accessories', 'Leather Goods'],
          images: [
            'https://images.unsplash.com/photo-1627123424574-724758594e93',
            'https://images.unsplash.com/photo-1606503825008-909a67e63c3d',
            'https://images.unsplash.com/photo-1577803645773-f96470509666',
            'https://images.unsplash.com/photo-1554866585-cd94860890b7'
          ],
          discount: 23,
          rating: 4.8,
          reviewCount: 42,
          variants: [
            {
              name: 'Color',
              options: ['Black', 'Brown', 'Tan']
            },
            {
              name: 'Size',
              options: ['Standard', 'Slim', 'Large']
            }
          ]
        };

        setProduct(mockProduct);
        setSelectedImage(mockProduct.images[0]);

        // Initialize selected variants with first option of each variant
        const initialVariants: Record<string, string> = {};
        mockProduct.variants?.forEach(variant => {
          initialVariants[variant.name] = variant.options[0];
        });
        setSelectedVariants(initialVariants);

      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= (product?.stock || 1)) {
      setQuantity(value);
    }
  };

  const handleVariantChange = (variantName: string, option: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [variantName]: option
    }));
  };

  const handleAddToCart = () => {
    // In a real app, this would dispatch to a cart context or state management
    console.log('Adding to cart:', {
      product,
      quantity,
      selectedVariants
    });

    // Show a temporary success message
    const successMessage = document.createElement('div');
    successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in';
    successMessage.textContent = 'Product added to cart!';
    document.body.appendChild(successMessage);

    setTimeout(() => {
      successMessage.classList.add('opacity-0', 'transition-opacity', 'duration-500');
      setTimeout(() => document.body.removeChild(successMessage), 500);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-8">{error || "The product you're looking for could not be found."}</p>
            <Link to="/" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700">
              Return to Home
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main>
        {/* Breadcrumbs */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex text-sm">
              <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
              <span className="mx-2 text-gray-400">/</span>
              {product.categories && product.categories[0] && (
                <>
                  <Link to={`/collections/${product.categories[0].toLowerCase()}`} className="text-gray-500 hover:text-gray-700">
                    {product.categories[0]}
                  </Link>
                  <span className="mx-2 text-gray-400">/</span>
                </>
              )}
              <span className="text-gray-900 font-medium">{product.title}</span>
            </nav>
          </div>
        </div>

        {/* Product Details */}
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 p-6">
              {/* Product Images - Left Column (Desktop) */}
              <div className="hidden lg:block lg:col-span-1">
                <div className="space-y-4">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(image)}
                      className={`block w-full aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === image ? 'border-blue-600' : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = `https://via.placeholder.com/150x150/e2e8f0/64748b?text=Image+${index + 1}`;
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Product Image */}
              <div className="lg:col-span-2">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={selectedImage}
                    alt={product.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `https://via.placeholder.com/600x600/e2e8f0/64748b?text=${encodeURIComponent(product.title)}`;
                    }}
                  />
                </div>

                {/* Mobile Image Selector */}
                <div className="flex gap-4 mt-4 lg:hidden overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(image)}
                      className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                        selectedImage === image ? 'border-blue-600' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = `https://via.placeholder.com/80x80/e2e8f0/64748b?text=${index + 1}`;
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div className="lg:col-span-2">
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{product.title}</h1>

                    {/* Rating */}
                    {product.rating && (
                      <div className="flex items-center mt-2">
                        <div className="flex text-yellow-400">
                          {'★'.repeat(Math.floor(product.rating))}
                          <span className="text-gray-300">
                            {'★'.repeat(5 - Math.floor(product.rating))}
                          </span>
                        </div>
                        {product.reviewCount && (
                          <a href="#reviews" className="ml-2 text-sm text-gray-500 hover:text-gray-700">
                            ({product.reviewCount} reviews)
                          </a>
                        )}
                      </div>
                    )}

                    {/* Price */}
                    <div className="mt-4 flex items-end">
                      <p className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
                      {product.originalPrice && (
                        <p className="ml-2 text-lg text-gray-500 line-through">
                          ${product.originalPrice.toFixed(2)}
                        </p>
                      )}
                      {product.discount && (
                        <span className="ml-2 bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                          Save {product.discount}%
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Short Description */}
                  <p className="text-gray-600">{product.description}</p>

                  {/* Variants */}
                  {product.variants?.map((variant) => (
                    <div key={variant.name} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {variant.name}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {variant.options.map((option) => (
                          <button
                            key={option}
                            onClick={() => handleVariantChange(variant.name, option)}
                            className={`px-4 py-2 rounded-md text-sm font-medium ${
                              selectedVariants[variant.name] === option
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Quantity */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Quantity
                    </label>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityChange(quantity - 1)}
                        className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                        className="w-20 text-center border rounded-md py-2"
                        min="1"
                        max={product.stock}
                      />
                      <button
                        onClick={() => handleQuantityChange(quantity + 1)}
                        className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
                        disabled={quantity >= product.stock}
                      >
                        +
                      </button>
                      <span className="text-sm text-gray-500 ml-2">
                        {product.stock} available
                      </span>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Add to Cart
                  </button>

                  {/* SKU */}
                  {product.sku && (
                    <p className="text-sm text-gray-500">
                      SKU: {product.sku}
                    </p>
                  )}

                  {/* Categories */}
                  {product.categories && product.categories.length > 0 && (
                    <div className="text-sm text-gray-500">
                      Categories: {product.categories.map((category, index) => (
                        <span key={category}>
                          <Link to={`/collections/${category.toLowerCase()}`} className="text-blue-600 hover:underline">
                            {category}
                          </Link>
                          {index < product.categories!.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Product Tabs */}
            <div className="border-t">
              <div className="container mx-auto px-6 py-8">
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8">
                    <a href="#description" className="border-blue-500 text-blue-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                      Description
                    </a>
                    <a href="#specifications" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                      Specifications
                    </a>
                    <a href="#reviews" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                      Reviews
                    </a>
                  </nav>
                </div>

                <div className="py-6">
                  <div id="description" className="prose max-w-none">
                    <h3 className="text-lg font-medium text-gray-900">Product Description</h3>
                    <p>{product.description}</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.</p>
                    <p>Features:</p>
                    <ul>
                      <li>Premium quality materials</li>
                      <li>Durable construction</li>
                      <li>Elegant design</li>
                      <li>Practical and functional</li>
                      <li>Perfect gift option</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">You May Also Like</h2>
            <Collection
              title="Related Products"
              products={relatedProducts}
              showFilters={false}
            />
          </div>
        </section>

        <Newsletter />
      </main>

      <Footer />
    </div>
  );
};