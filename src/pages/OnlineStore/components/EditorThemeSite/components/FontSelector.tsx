import React from 'react';

interface FontSelectorProps {
  value: string;
  onChange: (font: string) => void;
}

const fonts = [
  'Inter',
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Poppins',
  'Source Sans Pro',
  'Raleway',
];

export const FontSelector: React.FC<FontSelectorProps> = ({ value, onChange }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
    >
      {fonts.map((font) => (
        <option key={font} value={font} style={{ fontFamily: font }}>
          {font}
        </option>
      ))}
    </select>
  );
};