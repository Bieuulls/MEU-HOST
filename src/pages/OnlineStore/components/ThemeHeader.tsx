import React, { useState } from 'react';
import { Eye, Upload } from 'lucide-react';
import { ThemeUploadModal } from './ThemeUploadModal';
import { useNavigate } from 'react-router-dom';

export const ThemeHeader: React.FC = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Themes</h1>
        <div className="flex gap-3">
          <button
            onClick={() => window.open('/store', '_blank')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Eye className="w-4 h-4 mr-2" />
            View your store
          </button>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#404040] hover:bg-[#303030]"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import theme
          </button>
        </div>
      </div>

      <ThemeUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </>
  );
};