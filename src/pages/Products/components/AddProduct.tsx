import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { ChevronLeft, Upload, X, AlertCircle, Save, Loader2 } from 'lucide-react';
import { strapiClient, formatStrapiData } from '../../../lib/strapiClient';

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  stock: string;
  sku: string;
  barcode: string;
  weight: string;
  status: 'active' | 'draft' | 'archived' | 'out_of_stock' | 'scheduled' | 'discontinued';
  images: File[];
  categories: string[];
}

interface Category {
  id: string;
  name: string;
}

export const AddProduct: React.FC = () => {
  const navigate = useNavigate();
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
    categories: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  // Adicione esta função para limpar erros específicos quando o usuário edita um campo
  const handleInputChange = (field: keyof ProductFormData, value: string) => {
    // Limpar o erro específico quando o usuário edita o campo
    if (formErrors[field]) {
      setFormErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[field];
        return newErrors;
      });
    }

    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await strapiClient.get('/api/categories');
        if (response.data && response.data.data) {
          setCategories(response.data.data.map((category: any) => ({
            id: category.id,
            name: category.attributes.name
          })));
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Track form changes
  useEffect(() => {
    setIsDirty(true);
  }, [formData]);

  // Confirm before leaving if form is dirty
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 5,
    maxSize: 5242880, // 5MB
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        setFormErrors(prev => ({
          ...prev,
          images: 'Some files were rejected. Please check file type and size (max 5MB).'
        }));
      }

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...acceptedFiles]
      }));
    }
  });

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Product name is required';
    } else if (formData.name.trim().length > 100) {
      errors.name = 'Product name must be less than 100 characters';
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }

    const price = Number(formData.price);
    if (isNaN(price) || price <= 0) {
      errors.price = 'Price must be a valid positive number';
    }

    const stock = Number(formData.stock);
    if (isNaN(stock) || stock < 0 || !Number.isInteger(Number(formData.stock))) {
      errors.stock = 'Stock must be a valid non-negative integer';
    }

    if (formData.weight && (isNaN(Number(formData.weight)) || Number(formData.weight) < 0)) {
      errors.weight = 'Weight must be a valid non-negative number';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorField = Object.keys(formErrors)[0];
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Prepare data for Strapi
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        stock: Number(formData.stock),
        sku: formData.sku || '',
        barcode: formData.barcode || '',
        weight: formData.weight ? Number(formData.weight) : null,
        status: formData.status,
        categories: formData.categories,
        tenant_id: '1' // Get from context in real app
      };

      // Prepare images
      const imageFiles = formData.images.reduce((acc, file) => {
        if (!acc.images) acc.images = [];
        acc.images.push(file);
        return acc;
      }, {} as { images: File[] });

      const formDataToSend = formatStrapiData(productData, imageFiles);

      const response = await strapiClient.post('/api/products', formDataToSend);

      if (response.data) {
        setIsDirty(false);
        navigate('/dashboard/products', {
          state: {
            notification: {
              type: 'success',
              message: 'Product created successfully'
            }
          }
        });
      }
    } catch (err: any) {
      console.error('Error creating product:', err);
      const errorMessage = err.response?.data?.error?.message || 'Failed to create product';
      setError(errorMessage);

      // Scroll to error message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        navigate('/dashboard/products');
      }
    } else {
      navigate('/dashboard/products');
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setFormData(prev => {
      if (prev.categories.includes(categoryId)) {
        return {
          ...prev,
          categories: prev.categories.filter(id => id !== categoryId)
        };
      } else {
        return {
          ...prev,
          categories: [...prev.categories, categoryId]
        };
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => handleCancel()}
                className="mr-4 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Go back"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Add Product</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                form="product-form"
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Product
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('basic')}
              className={`${
                activeTab === 'basic'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Basic Information
            </button>
            <button
              onClick={() => setActiveTab('media')}
              className={`${
                activeTab === 'media'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Media
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`${
                activeTab === 'categories'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Categories
            </button>
          </nav>
        </div>

        <form id="product-form" onSubmit={handleSubmit} className="space-y-8">
          {activeTab === 'basic' && (
            <div className="bg-white shadow-sm rounded-lg p-6 space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Product Name*
                  {formErrors.name && (
                    <span className="text-red-500 text-xs ml-2">{formErrors.name}</span>
                  )}
                </label>
                <input
                                    type="text"
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className={`mt-1 block w-full rounded-md border ${
                                      formErrors.name ? 'border-red-300' : 'border-gray-300'
                                    } shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                    required
                                  />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description*
                  {formErrors.description && (
                    <span className="text-red-500 text-xs ml-2">{formErrors.description}</span>
                  )}
                </label>
                <textarea
                  id="description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    formErrors.description ? 'border-red-300' : 'border-gray-300'
                  }`}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Price*
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
                      className={`pl-7 block w-full rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                        formErrors.price ? 'border-red-300' : 'border-gray-300'
                      }`}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                    Stock*
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
                    className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      formErrors.stock ? 'border-red-300' : 'border-gray-300'
                    }`}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as ProductFormData['status'] })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                    <option value="out_of_stock">Out of Stock</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="discontinued">Discontinued</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
                    SKU
                  </label>
                  <input
                    type="text"
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

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
                    className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      formErrors.weight ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="bg-white shadow-sm rounded-lg p-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Product Images</h3>
                <div className="space-y-4">
                  <div
                    {...getRootProps()}
                    className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <input {...getInputProps()} />
                    <Upload className="h-10 w-10 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">
                      Drag & drop images here, or click to select files
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      JPG, PNG, WEBP up to 5MB (max 5 files)
                    </p>
                  </div>

                  {formErrors.images && (
                    <p className="text-red-500 text-xs">{formErrors.images}</p>
                  )}

                  {formData.images.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Images</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {formData.images.map((file, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square bg-gray-100 rounded-md overflow-hidden">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`Product image ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="bg-white shadow-sm rounded-lg p-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Product Categories</h3>
                {categories.length === 0 ? (
                  <p className="text-gray-500">No categories found. Please create categories first.</p>
                ) : (
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`category-${category.id}`}
                          checked={formData.categories.includes(category.id)}
                          onChange={() => handleCategoryChange(category.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor={`category-${category.id}`}
                          className="ml-2 block text-sm text-gray-700"
                        >
                          {category.name}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};