import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, MoreVertical, Trash2, Edit2, ImageIcon, Filter, Download, ChevronDown, Eye, Archive } from 'lucide-react';
import axios from 'axios';
import { ProductModal } from '../components/products/ProductModal';

export const Products: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showActions, setShowActions] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [viewingProduct, setViewingProduct] = useState<any>(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:3001/products', {
        params: {
          tenant_id: '1' // You should get this from your auth context
        }
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error loading products:', error);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleArchiveProduct = async (productId: string) => {
    try {
      await axios.patch(`http://localhost:3001/products/${productId}`, { status: 'archived' });
      await loadProducts();
    } catch (error) {
      console.error('Error archiving product:', error);
      setError('Failed to archive product. Please try again.');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3001/products/${productId}`);
      await loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      setError('Failed to delete product. Please try again.');
    }
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === products.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(products.map(p => p.id.toString()));
    }
  };

  const toggleSelectItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">Products</h1>
          <span className="text-gray-500 text-sm">{products.length} products</span>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => navigate('/dashboard/products/add')}
            className="flex items-center px-4 py-2 bg-[#404040] text-white rounded-md hover:bg-[#303030]"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add product
          </button>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 w-80 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
            </div>
            <button className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
            <button className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md">
              <span className="mr-2">Sort</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Products Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
          <p className="text-gray-500 mb-6">Get started by adding your first product</p>
          <button
            onClick={() => navigate('/dashboard/products/add')}
            className="inline-flex items-center px-4 py-2 bg-[#404040] text-white rounded-md hover:bg-[#303030]"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add your first product
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {selectedItems.length > 0 && (
            <div className="bg-gray-50 px-6 py-3 border-b flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {selectedItems.length} selected
                </span>
                <button
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to delete ${selectedItems.length} products?`)) {
                      Promise.all(selectedItems.map(id => axios.delete(`http://localhost:3001/products/${id}`)))
                        .then(() => {
                          loadProducts();
                          setSelectedItems([]);
                        })
                        .catch(error => {
                          console.error('Error deleting products:', error);
                          setError('Failed to delete products. Please try again.');
                        });
                    }
                  }}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Delete selected
                </button>
              </div>
              <button
                onClick={() => setSelectedItems([])}
                className="text-sm text-gray-600 hover:text-gray-700"
              >
                Clear selection
              </button>
            </div>
          )}
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === products.length}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-[#404040] focus:ring-[#404040]"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(product.id.toString())}
                      onChange={() => toggleSelectItem(product.id.toString())}
                      className="rounded border-gray-300 text-[#404040] focus:ring-[#404040]"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-gray-400" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.stock}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${product.price.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="relative">
                      <button
                        onClick={() => setShowActions(showActions === product.id ? null : product.id)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      {showActions === product.id && (
                        <div className="fixed right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5" style={{ zIndex: 50, transform: 'translateX(-100%)' }}>
                          <div className="py-1">
                            <button
                              onClick={() => {
                                const productToEdit = products.find(p => p.id === product.id);
                                if (productToEdit) {
                                  setShowActions(null);
                                  setEditingProduct(productToEdit);
                                  setIsProductModalOpen(true);
                                }
                              }}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                            >
                              <Edit2 className="w-4 h-4 mr-2" />
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                const productToView = products.find(p => p.id === product.id);
                                if (productToView) {
                                  setShowActions(null);
                                  setViewingProduct(productToView);
                                  setIsViewModalOpen(true);
                                }
                              }}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </button>
                            <button
                              onClick={() => {
                                const productToArchive = products.find(p => p.id === product.id);
                                if (productToArchive) {
                                  setShowActions(null);
                                  handleArchiveProduct(productToArchive.id);
                                }
                              }}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                            >
                              <Archive className="w-4 h-4 mr-2" />
                              Archive
                            </button>
                            <button
                              onClick={() => {
                                handleDeleteProduct(product.id);
                                setShowActions(null);
                              }}
                              className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Product Modal */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={async (product) => {
          await loadProducts();
          setIsProductModalOpen(false);
          setEditingProduct(null);
        }}
        initialData={editingProduct}
        mode="edit"
      />

      {/* View Modal */}
      <ProductModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setViewingProduct(null);
        }}
        onSubmit={() => {}}
        initialData={viewingProduct}
        mode="view"
      />
    </div>
  );
};