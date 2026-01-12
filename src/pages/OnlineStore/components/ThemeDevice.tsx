import React from 'react';

interface ThemeDeviceProps {
  type: 'desktop' | 'mobile';
}

export const ThemeDevice: React.FC<ThemeDeviceProps> = ({ type }) => {
  const previewImage = "https://cdn.shopify.com/s/files/1/0646/9753/2585/files/dawn-preview.png?v=1683820138";

  return (
    <div className={`flex-1 ${type === 'mobile' ? 'max-w-[240px]' : ''}`}>
      <div className={`
        aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden
        ${type === 'mobile' ? 'aspect-[9/16]' : ''}
      `}>
        <img
          src={previewImage}
          alt={`${type} preview`}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};
