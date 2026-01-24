import React from 'react';
import { FontSelector } from './FontSelector';

interface TypographyControlProps {
  settings: any;
  onChange: (settings: any) => void;
}

export const TypographyControl: React.FC<TypographyControlProps> = ({ settings, onChange }) => {
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
          Font Family
        </label>
        <FontSelector
          value={settings.fontFamily || 'Inter'}
          onChange={(font) => handleChange('fontFamily', font)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Font Size
        </label>
        <input
          type="number"
          value={settings.fontSize || ''}
          onChange={(e) => handleChange('fontSize', e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Font Weight
        </label>
        <select
          value={settings.fontWeight || '400'}
          onChange={(e) => handleChange('fontWeight', e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
        >
          <option value="300">Light</option>
          <option value="400">Regular</option>
          <option value="500">Medium</option>
          <option value="600">Semi Bold</option>
          <option value="700">Bold</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Line Height
        </label>
        <input
          type="number"
          step="0.1"
          value={settings.lineHeight || ''}
          onChange={(e) => handleChange('lineHeight', e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Letter Spacing
        </label>
        <input
          type="number"
          step="0.1"
          value={settings.letterSpacing || ''}
          onChange={(e) => handleChange('letterSpacing', e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Text Transform
        </label>
        <select
          value={settings.textTransform || 'none'}
          onChange={(e) => handleChange('textTransform', e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
        >
          <option value="none">None</option>
          <option value="uppercase">Uppercase</option>
          <option value="lowercase">Lowercase</option>
          <option value="capitalize">Capitalize</option>
        </select>
      </div>
    </div>
  );
};