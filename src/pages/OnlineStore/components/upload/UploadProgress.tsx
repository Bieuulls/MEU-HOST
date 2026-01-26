import React from 'react';
import { UploadProgress as ProgressType } from '../../types';

interface UploadProgressProps {
  progress: ProgressType;
}

export const UploadProgress: React.FC<UploadProgressProps> = ({ progress }) => {
  return (
    <div className="mt-4">
      <div className="flex justify-between text-sm text-gray-600 mb-1">
        <span>Uploading...</span>
        <span>{progress.percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress.percentage}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-1">
        {Math.round(progress.loaded / 1024 / 1024)}MB of {Math.round(progress.total / 1024 / 1024)}MB
      </p>
    </div>
  );
};
