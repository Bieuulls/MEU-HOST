import React, { useState } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import ThemePreview from './ThemePreview';

const ThemeEditor: React.FC = () => {
  const { theme, updateTheme } = useTheme();
  const [activeSection, setActiveSection] = useState<string>('general');

  const sections = [
    { id: 'general', title: 'General Settings' },
    { id: 'header', title: 'Header' },
    { id: 'hero', title: 'Hero Section' },
    { id: 'carousel', title: 'Carousel' },
    { id: 'featured', title: 'Featured Products' },
    { id: 'collections', title: 'Collections' },
    { id: 'newsletter', title: 'Newsletter' },
    { id: 'footer', title: 'Footer' }
  ];

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Colors</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
                  <input
                    type="color"
                    value={theme.colors.primary}
                    onChange={(e) => updateTheme('colors', { ...theme.colors, primary: e.target.value })}
                    className="w-full h-10 rounded border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Color</label>
                  <input
                    type="color"
                    value={theme.colors.secondary}
                    onChange={(e) => updateTheme('colors', { ...theme.colors, secondary: e.target.value })}
                    className="w-full h-10 rounded border border-gray-300"
                  />
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Typography</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Heading Font</label>
                  <select
                    value={theme.typography.headingFont}
                    onChange={(e) => updateTheme('typography', { ...theme.typography, headingFont: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Open Sans">Open Sans</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Body Font</label>
                  <select
                    value={theme.typography.bodyFont}
                    onChange={(e) => updateTheme('typography', { ...theme.typography, bodyFont: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Open Sans">Open Sans</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 'header':
        return (
          <div className="space-y-6">
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={theme.header.showTopBar}
                  onChange={(e) => updateTheme('header', { ...theme.header, showTopBar: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700">Show Top Bar</span>
              </label>
            </div>
            {theme.header.showTopBar && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Top Bar Background</label>
                  <input
                    type="color"
                    value={theme.header.topBarBg}
                    onChange={(e) => updateTheme('header', { ...theme.header, topBarBg: e.target.value })}
                    className="w-full h-10 rounded border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Top Bar Text Color</label>
                  <input
                    type="color"
                    value={theme.header.topBarText}
                    onChange={(e) => updateTheme('header', { ...theme.header, topBarText: e.target.value })}
                    className="w-full h-10 rounded border border-gray-300"
                  />
                </div>
              </div>
            )}
          </div>
        );

      // Add more section content here
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-lg font-medium text-gray-900">Theme Editor</h2>
        </div>
        <nav className="space-y-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full text-left px-4 py-2 text-sm ${activeSection === section.id ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              {section.title}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Settings Panel */}
        <div className="w-96 bg-white border-r border-gray-200 overflow-y-auto p-6">
          {renderSectionContent()}
        </div>

        {/* Preview */}
        <div className="flex-1">
          <ThemePreview tenantId="1" />
        </div>
      </div>
    </div>
  );
};

export default ThemeEditor;