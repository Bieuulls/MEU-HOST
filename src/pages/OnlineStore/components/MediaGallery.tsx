import React, { useState } from 'react';
import axios from 'axios';
import { Upload, AlertCircle } from 'lucide-react';

interface MediaGalleryProps {
  onUploadComplete?: (urls: string[]) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const MediaGallery: React.FC<MediaGalleryProps> = ({
  onUploadComplete,
  maxFiles = 10,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/gif']
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const uploadImages = async (files: FileList) => {
    if (files.length > maxFiles) {
      setError(`You can only upload up to ${maxFiles} files at once`);
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    Array.from(files).forEach(file => {
      if (!acceptedTypes.includes(file.type)) {
        setError('Invalid file type. Please upload only images.');
        return;
      }
      formData.append('image', file);
    });

    try {
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setUploadProgress(progress);
        }
      });

      if (response.data.url && onUploadComplete) {
        onUploadComplete([response.data.url]);
      }
    } catch (err) {
      console.error('Error uploading images:', err);
      setError('Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="p-4 border-2 border-dashed rounded-lg">
      <div className="flex flex-col items-center justify-center gap-4">
        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-md w-full">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        <label className="flex flex-col items-center justify-center w-full h-32 cursor-pointer hover:bg-gray-50 transition-colors rounded-lg">
          <input
            type="file"
            multiple
            accept={acceptedTypes.join(',')}
            className="hidden"
            onChange={(e) => e.target.files && uploadImages(e.target.files)}
            disabled={uploading}
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <span className="text-sm text-gray-500">
                Uploading... {uploadProgress}%
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-8 h-8 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">
                Click to upload images
              </span>
              <span className="text-xs text-gray-500">
                PNG, JPG, GIF up to 10MB each
              </span>
            </div>
          )}
        </label>
      </div>
    </div>
  );
};