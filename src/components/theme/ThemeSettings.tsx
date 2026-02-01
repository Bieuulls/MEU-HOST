import React from 'react';
import { ColorPicker } from './ColorPicker';
import { FontSelector } from './FontSelector';
import { SpacingControl } from './SpacingControl';
import { useTheme } from '../../contexts/ThemeContext';

interface ThemeSettingsProps {
  activeSection: string;
}

export const ThemeSettings: React.FC<ThemeSettingsProps> = ({ activeSection }) => {
  const { theme, updateTheme } = useTheme();

  const renderSectionSettings = () => {
    switch (activeSection) {
      case 'header':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Top Bar</h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Show top bar</span>
                  <input
                    type="checkbox"
                    checked={theme.header.showTopBar}
                    onChange={(e) => updateTheme('header', {
                      ...theme.header,
                      showTopBar: e.target.checked
                    })}
                    className="rounded border-gray-300"
                  />
                </label>
                {theme.header.showTopBar && (
                  <>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Background Color</label>
                      <ColorPicker
                        color={theme.header.topBarBg}
                        onChange={(color) => updateTheme('header', {
                          ...theme.header,
                          topBarBg: color
                        })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Text Color</label>
                      <ColorPicker
                        color={theme.header.topBarText}
                        onChange={(color) => updateTheme('header', {
                          ...theme.header,
                          topBarText: color
                        })}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Navigation</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Menu Type</label>
                  <select
                    value={theme.header.menuType}
                    onChange={(e) => updateTheme('header', {
                      ...theme.header,
                      menuType: e.target.value as 'default' | 'mega_menu' | 'simple'
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="default">Default</option>
                    <option value="mega_menu">Mega Menu</option>
                    <option value="simple">Simple</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Background Color</label>
                  <ColorPicker
                    color={theme.header.menuBg}
                    onChange={(color) => updateTheme('header', {
                      ...theme.header,
                      menuBg: color
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Text Color</label>
                  <ColorPicker
                    color={theme.header.menuText}
                    onChange={(color) => updateTheme('header', {
                      ...theme.header,
                      menuText: color
                    })}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'hero':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Layout</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Style</label>
                  <select
                    value={theme.hero.style}
                    onChange={(e) => updateTheme('hero', {
                      ...theme.hero,
                      style: e.target.value as 'fullwidth' | 'boxed'
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="fullwidth">Full Width</option>
                    <option value="boxed">Boxed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Height</label>
                  <select
                    value={theme.hero.height}
                    onChange={(e) => updateTheme('hero', {
                      ...theme.hero,
                      height: e.target.value as 'small' | 'medium' | 'large'
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Content</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={theme.hero.title.text}
                    onChange={(e) => updateTheme('hero', {
                      ...theme.hero,
                      title: { ...theme.hero.title, text: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={theme.hero.subtitle.text}
                    onChange={(e) => updateTheme('hero', {
                      ...theme.hero,
                      subtitle: { ...theme.hero.subtitle, text: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'carousel':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Autoplay</h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Enable autoplay</span>
                  <input
                    type="checkbox"
                    checked={theme.carousel.autoplay}
                    onChange={(e) => updateTheme('carousel', {
                      ...theme.carousel,
                      autoplay: e.target.checked
                    })}
                    className="rounded border-gray-300"
                  />
                </label>
                {theme.carousel.autoplay && (
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Autoplay Time (seconds)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={theme.carousel.autoplayTime / 1000}
                      onChange={(e) => updateTheme('carousel', {
                        ...theme.carousel,
                        autoplayTime: parseInt(e.target.value) * 1000
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Controls</h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Show controls</span>
                  <input
                    type="checkbox"
                    checked={theme.carousel.showControls}
                    onChange={(e) => updateTheme('carousel', {
                      ...theme.carousel,
                      showControls: e.target.checked
                    })}
                    className="rounded border-gray-300"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Show indicators</span>
                  <input
                    type="checkbox"
                    checked={theme.carousel.showIndicators}
                    onChange={(e) => updateTheme('carousel', {
                      ...theme.carousel,
                      showIndicators: e.target.checked
                    })}
                    className="rounded border-gray-300"
                  />
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8 text-gray-500">
            <p>Select a section to customize its settings</p>
          </div>
        );
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        {sections.find(s => s.id === activeSection)?.title || 'Settings'}
      </h2>
      {renderSectionSettings()}
    </div>
  );
};

const sections = [
  { id: 'header', title: 'Header' },
  { id: 'hero', title: 'Hero Section' },
  { id: 'carousel', title: 'Carousel' },
  { id: 'footer', title: 'Footer' },
];