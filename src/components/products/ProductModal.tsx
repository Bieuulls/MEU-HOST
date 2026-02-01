import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import { MediaGallery } from './MediaGallery';

interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  sku?: string;
  barcode?: string;
  weight?: number;
  status: 'active' | 'draft';
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: Product) => void;
  initialData?: Product;
  mode: 'create' | 'edit';
}

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  stock: string;
  sku: string;
  barcode: string;
  weight: string;
  status: 'active' | 'draft';
  images: (string | File)[];
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
}) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    stock: '',
    sku: '',
    barcode: '',
    weight: '',
    status: 'active',
    images: [],
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        price: initialData.price?.toString() || '',
        stock: initialData.stock?.toString() || '',
        sku: initialData.sku || '',
        barcode: initialData.barcode || '',
        weight: initialData.weight?.toString() || '',
        status: initialData.status || 'active',
        images: initialData.image ? [initialData.image] : [],
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        sku: '',
        barcode: '',
        weight: '',
        status: 'active',
      });
    }
    setFormErrors({});
  }, [initialData]);

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof ProductFormData, string>> = {};

    if (!formData.name.trim()) {
      errors.name = 'Title is required';
    } else if (formData.name.trim().length > 100) {
      errors.name = 'Title must be less than 100 characters';
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    } else if (formData.description.trim().length > 1000) {
      errors.description = 'Description must be less than 1000 characters';
    }

    const price = Number(formData.price);
    if (isNaN(price) || price < 0) {
      errors.price = 'Price must be a valid positive number';
    } else if (price > 1000000) {
      errors.price = 'Price must be less than 1,000,000';
    }

    const stock = Number(formData.stock);
    if (isNaN(stock) || stock < 0 || !Number.isInteger(stock)) {
      errors.stock = 'Stock must be a valid positive integer';
    } else if (stock > 1000000) {
      errors.stock = 'Stock must be less than 1,000,000';
    }

    if (formData.sku && formData.sku.length > 50) {
      errors.sku = 'SKU must be less than 50 characters';
    }

    if (formData.barcode && formData.barcode.length > 50) {
      errors.barcode = 'Barcode must be less than 50 characters';
    }

    if (formData.weight) {
      const weight = Number(formData.weight);
      if (isNaN(weight) || weight < 0) {
        errors.weight = 'Weight must be a valid positive number';
      } else if (weight > 1000) {
        errors.weight = 'Weight must be less than 1,000 kg';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const formDataToSend = new FormData();

      // Append all product data to FormData
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('price', formData.price);
      formDataToSend.append('stock', formData.stock);
      formDataToSend.append('status', formData.status);
      formDataToSend.append('tenant_id', '1');

      if (formData.sku) formDataToSend.append('sku', formData.sku);
      if (formData.barcode) formDataToSend.append('barcode', formData.barcode);
      if (formData.weight) formDataToSend.append('weight', formData.weight);

      // If there's an image, append it to FormData
      if (formData.images && formData.images.length > 0) {
        const image = formData.images[0];
        if (image instanceof File) {
          formDataToSend.append('image', image);
        }
      }

      const productData: Product = {
        ...(initialData?.id ? { id: initialData.id } : {}),
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        stock: Number(formData.stock),
        sku: formData.sku || undefined,
        barcode: formData.barcode || undefined,
        weight: formData.weight ? Number(formData.weight) : undefined,
        status: formData.status,
        tenant_id: '1'
      };

      if (mode === 'edit' && initialData?.id) {
        await axios.put(`http://localhost:3001/products/${initialData.id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axios.post('http://localhost:3001/products', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      onSubmit(productData);
      onClose();
    } catch (error: any) {
      console.error('Error saving product:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save product. Please try again.';
      setFormErrors({
        name: errorMessage
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center overflow-y-auto pt-4 pb-4">
      <div className="bg-white rounded-lg w-full max-w-4xl mx-4 my-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">
            {mode === 'create' ? 'Add product' : 'Edit product'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex border-b">
          <button
            type="button"
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'basic'
                ? 'text-[#404040] border-b-2 border-[#404040]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('basic')}
          >
            Basic information
          </button>
          <button
            type="button"
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'variants'
                ? 'text-[#404040] border-b-2 border-[#404040]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('variants')}
          >
            Variants
          </button>
        </div>

        <div className="p-6">
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {activeTab === 'basic' && (
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Title
                      {formErrors.name && (
                        <span className="text-red-500 text-xs ml-2">{formErrors.name}</span>
                      )}
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${formErrors.name ? 'border-red-300' : 'border-gray-300'}`}
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                      {formErrors.description && (
                        <span className="text-red-500 text-xs ml-2">{formErrors.description}</span>
                      )}
                    </label>
                    <textarea
                      id="description"
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${formErrors.description ? 'border-red-300' : 'border-gray-300'}`}
                    />
                  </div>

                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Media</h3>
                    <MediaGallery
                      images={formData.images}
                      onChange={(images) => setFormData({ ...formData, images })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                        Price
                        {formErrors.price && (
                          <span className="text-red-500 text-xs ml-2">{formErrors.price}</span>
                        )}
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                          type="number"
                          id="price"
                          step="0.01"
                          min="0"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          className={`pl-7 mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${formErrors.price ? 'border-red-300' : 'border-gray-300'}`}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                        Stock
                        {formErrors.stock && (
                          <span className="text-red-500 text-xs ml-2">{formErrors.stock}</span>
                        )}
                      </label>
                      <input
                        type="number"
                        id="stock"
                        min="0"
                        step="1"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${formErrors.stock ? 'border-red-300' : 'border-gray-300'}`}
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Media</h3>
                    <MediaGallery
                      images={formData.images}
                      onChange={(images) => setFormData({ ...formData, images })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
                        SKU
                      </label>
                      <input
                        type="text"
                        id="sku"
                        value={formData.sku}
                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="barcode" className="block text-sm font-medium text-gray-700">
                        Barcode
                      </label>
                      <input
                        type="text"
                        id="barcode"
                        value={formData.barcode}
                        onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Media</h3>
                    <MediaGallery
                      images={formData.images}
                      onChange={(images) => setFormData({ ...formData, images })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                        Weight (kg)
                        {formErrors.weight && (
                          <span className="text-red-500 text-xs ml-2">{formErrors.weight}</span>
                        )}
                      </label>
                      <input
                        type="number"
                        id="weight"
                        step="0.01"
                        min="0"
                        value={formData.weight}
                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                        className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${formErrors.weight ? 'border-red-300' : 'border-gray-300'}`}
                      />
                    </div>

                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                        Status
                      </label>
                      <select
                        id="status"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'draft' })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="active">Active</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'variants' && (
                <div className="text-center py-8 text-gray-500">
                  <p>Variant management coming soon...</p>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {mode === 'create' ? 'Create' : 'Save changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};