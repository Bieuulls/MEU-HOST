import React, { useCallback } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { useThemeUpload } from '../hooks/useThemeUpload';
import { DropZone } from './upload/DropZone';
import { UploadProgress } from './upload/UploadProgress';

interface ThemeUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ThemeUploadModal: React.FC<ThemeUploadModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { uploadTheme, error, isUploading, progress } = useThemeUpload();

  const handleFileSelect = useCallback(async (file: File) => {
    const theme = await uploadTheme(file);
    if (theme) {
      onSuccess?.();
      onClose();
    }
  }, [uploadTheme, onSuccess, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-xl mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Upload theme</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={isUploading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-600 mb-4">
            Upload a .zip file of your Shopify theme. Uploaded themes are not published automatically.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Maximum file size: 50 MB
          </p>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          <DropZone
            onFileSelect={handleFileSelect}
            disabled={isUploading}
          />

          {progress && <UploadProgress progress={progress} />}
        </div>

        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            disabled={isUploading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-[#404040] rounded-md hover:bg-[#303030] disabled:opacity-50"
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Upload theme'}
          </button>
        </div>
      </div>
    </div>
  );
};
