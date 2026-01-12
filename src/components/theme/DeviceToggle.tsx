import React from 'react';
import { Monitor, Smartphone } from 'lucide-react';

interface DeviceToggleProps {
  viewMode: 'desktop' | 'mobile';
  onChange: (mode: 'desktop' | 'mobile') => void;
}

export const DeviceToggle: React.FC<DeviceToggleProps> = ({ viewMode, onChange }) => {
  return (
    <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
      <button
        onClick={() => onChange('desktop')}
        className={`p-2 rounded-md transition-colors ${
          viewMode === 'desktop'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
        title="Desktop view"
      >
        <Monitor className="w-5 h-5" />
      </button>
      <button
        onClick={() => onChange('mobile')}
        className={`p-2 rounded-md transition-colors ${
          viewMode === 'mobile'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
        title="Mobile view"
      >
        <Smartphone className="w-5 h-5" />
      </button>
    </div>
  );
};