import React from 'react';

interface SpacingControlProps {
  value: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  onChange: (spacing: any) => void;
  label?: string;
  type?: 'padding' | 'margin';
}

export const SpacingControl: React.FC<SpacingControlProps> = ({
  value,
  onChange,
  label = 'Spacing',
  type = 'padding'
}) => {
  const handleChange = (side: string, newValue: string) => {
    onChange({
      ...value,
      [side]: newValue
    });
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <input
            type="number"
            placeholder="Top"
            value={value.top || ''}
            onChange={(e) => handleChange('top', e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
          />
        </div>
        <div>
          <input
            type="number"
            placeholder="Right"
            value={value.right || ''}
            onChange={(e) => handleChange('right', e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
          />
        </div>
        <div>
          <input
            type="number"
            placeholder="Bottom"
            value={value.bottom || ''}
            onChange={(e) => handleChange('bottom', e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
          />
        </div>
        <div>
          <input
            type="number"
            placeholder="Left"
            value={value.left || ''}
            onChange={(e) => handleChange('left', e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
          />
        </div>
      </div>
    </div>
  );
};