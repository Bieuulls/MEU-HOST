import React from 'react';

interface SpacingControlProps {
  settings: any;
  onChange: (settings: any) => void;
}

export const SpacingControl: React.FC<SpacingControlProps> = ({ settings, onChange }) => {
  const handleChange = (property: string, value: string) => {
    onChange({
      ...settings,
      [property]: value
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Padding
        </label>
        <div className="grid grid-cols-4 gap-2">
          <input
            type="number"
            placeholder="Top"
            value={settings.paddingTop || ''}
            onChange={(e) => handleChange('paddingTop', e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded-md text-sm"
          />
          <input
            type="number"
            placeholder="Right"
            value={settings.paddingRight || ''}
            onChange={(e) => handleChange('paddingRight', e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded-md text-sm"
          />
          <input
            type="number"
            placeholder="Bottom"
            value={settings.paddingBottom || ''}
            onChange={(e) => handleChange('paddingBottom', e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded-md text-sm"
          />
          <input
            type="number"
            placeholder="Left"
            value={settings.paddingLeft || ''}
            onChange={(e) => handleChange('paddingLeft', e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded-md text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Margin
        </label>
        <div className="grid grid-cols-4 gap-2">
          <input
            type="number"
            placeholder="Top"
            value={settings.marginTop || ''}
            onChange={(e) => handleChange('marginTop', e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded-md text-sm"
          />
          <input
            type="number"
            placeholder="Right"
            value={settings.marginRight || ''}
            onChange={(e) => handleChange('marginRight', e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded-md text-sm"
          />
          <input
            type="number"
            placeholder="Bottom"
            value={settings.marginBottom || ''}
            onChange={(e) => handleChange('marginBottom', e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded-md text-sm"
          />
          <input
            type="number"
            placeholder="Left"
            value={settings.marginLeft || ''}
            onChange={(e) => handleChange('marginLeft', e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded-md text-sm"
          />
        </div>
      </div>
    </div>
  );
};