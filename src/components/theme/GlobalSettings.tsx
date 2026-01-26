import React from 'react';
import { ColorPicker } from './ColorPicker';
import { FontSelector } from './FontSelector';
import { useTheme } from '../../contexts/ThemeContext';

export const GlobalSettings: React.FC = () => {
  const { theme, updateTheme } = useTheme();

  return (
    <div className="p-4 space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Global Theme Settings</h3>

        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Colors</h4>
            <div className="space-y-3">
              <ColorPicker
                label="Primary Color"
                color={theme.colors.primary}
                onChange={(color) => updateTheme('colors', {
                  ...theme.colors,
                  primary: color
                })}
              />
              <ColorPicker
                label="Secondary Color"
                color={theme.colors.secondary}
                onChange={(color) => updateTheme('colors', {
                  ...theme.colors,
                  secondary: color
                })}
              />
              <ColorPicker
                label="Accent Color"
                color={theme.colors.accent}
                onChange={(color) => updateTheme('colors', {
                  ...theme.colors,
                  accent: color
                })}
              />
              <ColorPicker
                label="Background Color"
                color={theme.colors.background}
                onChange={(color) => updateTheme('colors', {
                  ...theme.colors,
                  background: color
                })}
              />
              <ColorPicker
                label="Text Color"
                color={theme.colors.text}
                onChange={(color) => updateTheme('colors', {
                  ...theme.colors,
                  text: color
                })}
              />
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Typography</h4>
            <div className="space-y-3">
              <FontSelector
                label="Heading Font"
                value={theme.typography.headingFont}
                onChange={(font) => updateTheme('typography', {
                  ...theme.typography,
                  headingFont: font
                })}
              />
              <FontSelector
                label="Body Font"
                value={theme.typography.bodyFont}
                onChange={(font) => updateTheme('typography', {
                  ...theme.typography,
                  bodyFont: font
                })}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Base Size</label>
                <select
                  value={theme.typography.baseSize}
                  onChange={(e) => updateTheme('typography', {
                    ...theme.typography,
                    baseSize: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="14px">14px</option>
                  <option value="16px">16px</option>
                  <option value="18px">18px</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Layout</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Width</label>
                <select
                  value={theme.layout.maxWidth}
                  onChange={(e) => updateTheme('layout', {
                    ...theme.layout,
                    maxWidth: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="1024px">1024px</option>
                  <option value="1280px">1280px</option>
                  <option value="1536px">1536px</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Container Padding</label>
                <select
                  value={theme.layout.containerPadding}
                  onChange={(e) => updateTheme('layout', {
                    ...theme.layout,
                    containerPadding: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="0.5rem">0.5rem</option>
                  <option value="1rem">1rem</option>
                  <option value="1.5rem">1.5rem</option>
                  <option value="2rem">2rem</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};