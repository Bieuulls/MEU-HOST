import React from 'react';
import { ColorPicker } from './ColorPicker';

interface BorderControlProps {
  settings: any;
  onChange: (settings: any) => void;
}

export const BorderControl: React.FC<BorderControlProps> = ({ settings, onChange }) => {
  const handleChange = (property: string, value: any) => {
    onChange({
      ...settings,
      [property]: value
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Border Width
        </label>
        <input
          type="number"
          value={settings.borderWidth || ''}
          onChange={(e) => handleChange('borderWidth', e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Border Style
        </label>
        <select
          value={settings.borderStyle || 'solid'}
          onChange={(e) => handleChange('borderStyle', e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
        >
          <option value="solid">Solid</option>
          <option value="dashed">Dashed</option>
          <option value="dotted">Dotted</option>
          <option value="double">Double</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Border Color
        </label>
        <ColorPicker
          color={settings.borderColor || '#000000'}
          onChange={(color) => handleChange('borderColor', color)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Border Radius
        </label>
        <input
          type="number"
          value={settings.borderRadius || ''}
          onChange={(e) => handleChange('borderRadius', e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500"
        />
      </div>
    </div>
  );
};