import React, { useState, useCallback } from 'react';
import { Image as ImageIcon, Plus, X } from 'lucide-react';
import { imageService } from '../../services/imageService';

interface MediaGalleryProps {
  images: (string | File)[];
  onChange: (images: (string | File)[]) => void;
}

export const MediaGallery: React.FC<MediaGalleryProps> = ({ images = [], onChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const uploadImages = async (files: File[]) => {
    setIsUploading(true);
    setUploadError(null);

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to upload image');
        }

        const data = await response.json();
        return data.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      onChange([...images, ...uploadedUrls]);
    } catch (error) {
      console.error('Error uploading images:', error);
      setUploadError('Failed to upload images. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length > 0) {
      uploadImages(imageFiles);
    }
  }, [images, onChange]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length > 0) {
      uploadImages(imageFiles);
    }
  }, [images, onChange]);

  const removeImage = useCallback((index: number) => {
    const newImages = [...images];
    const removedImage = newImages[index];

    // If the image is a URL, attempt to delete it from the server
    if (typeof removedImage === 'string' && removedImage.startsWith('/uploads/')) {
      const fileName = removedImage.split('/').pop();
      if (fileName) {
        imageService.deleteImage(fileName).catch(console.error);
      }
    }

    newImages.splice(index, 1);
    onChange(newImages);
  }, [images, onChange]);

  const getImageUrl = (image: string | File) => {
    if (typeof image === 'string') {
      return image;
    }
    return URL.createObjectURL(image);
  };

  return (
    <div className="space-y-4">
      <div
        className={`
          border-2 border-dashed rounded-lg p-6
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${images.length > 0 ? 'border-solid' : 'border-dashed'}
          ${isUploading ? 'opacity-50' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {images.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group aspect-square">
                <img
                  src={getImageUrl(image)}
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
                {index === 0 && (
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-gray-900 bg-opacity-75 rounded text-white text-xs">
                    Main
                  </div>
                )}
              </div>
            ))}
            <label className="relative aspect-square cursor-pointer">
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
                disabled={isUploading}
              />
              <div className="h-full border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:text-gray-500">
                <Plus className="w-8 h-8 mb-2" />
                <span className="text-sm">Add image</span>
              </div>
            </label>
          </div>
        ) : (
          <label className="cursor-pointer">
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
              disabled={isUploading}
            />
            <div className="text-center">
              <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <div className="text-gray-600 font-medium mb-1">
                Add images
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Drag and drop or click to upload up to 10 images
              </p>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                disabled={isUploading}
              >
                Add files
              </button>
            </div>
          </label>
        )}
      </div>

      {uploadError && (
        <div className="text-sm text-red-600">{uploadError}</div>
      )}

      {images.length > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{images.length} images</span>
          <button
            type="button"
            onClick={() => onChange([])}
            className="text-red-600 hover:text-red-700"
            disabled={isUploading}
          >
            Remove all
          </button>
        </div>
      )}
    </div>
  );
};
