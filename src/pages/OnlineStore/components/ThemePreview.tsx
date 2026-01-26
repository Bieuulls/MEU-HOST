import React from 'react';
import { Lock } from 'lucide-react';
import { ThemeDevice } from './ThemeDevice';
import { useNavigate } from 'react-router-dom';

export const ThemePreview: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <img
              src="https://cdn.shopify.com/s/files/1/0646/9753/2585/files/dawn-theme.png?v=1683820138"
              alt="Dawn Theme"
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-medium">Dawn</h2>
                <span className="px-2 py-1 text-xs font-medium bg-gray-100 rounded">Current theme</span>
              </div>
              <p className="text-sm text-gray-500">Dawn version 15.2.0</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              Actions
            </button>
            <button
              onClick={() => navigate('/dashboard/theme-editor')}
              className="px-4 py-2 text-sm font-medium text-white bg-[#404040] rounded-md hover:bg-[#303030]"
            >
              Customize
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          <ThemeDevice type="desktop" />
          <ThemeDevice type="mobile" />
        </div>

        <div className="mt-4 p-4 bg-[#FFF7E6] rounded-lg border border-[#FFE5B2] flex items-center gap-3">
          <Lock className="w-5 h-5 text-[#B98900]" />
          <div className="flex-1">
            <p className="text-[#B98900]">
              Your online store is password protected. To remove the password, pick a plan.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              Manage password
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-[#404040] rounded-md hover:bg-[#303030]">
              Pick a plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};