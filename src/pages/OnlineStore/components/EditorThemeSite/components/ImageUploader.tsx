import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';

interface ImageUploaderProps {
  currentImage?: string;
  onUpload: (url: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ currentImage, onUpload }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // In a real app, you would upload the file to your storage service here
    // For now, we'll just create an object URL
    const url = URL.createObjectURL(acceptedFiles[0]);
    onUpload(url);
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1
  });

  return (
    <div>
      {currentImage ? (
        <div className="relative">
          <img
            src={currentImage}
            alt="Uploaded"
            className="w-full h-32 object-cover rounded-md"
          />
          <button
            onClick={() => onUpload('')}
            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">
            {isDragActive
              ? 'Drop the image here'
              : 'Drag & drop an image here, or click to select one'
          }
          </p>
        </div>
      )}
    </div>
  );
};