import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Eye,
  Save,
  LayoutTemplate,
  Palette,
  Settings,
  Search
} from 'lucide-react';
import { useTheme } from '../../../../contexts/ThemeContext';
import { SectionsList } from '../../../../components/theme/SectionsList';
import { ThemeSettings } from '../../../../components/theme/ThemeSettings';
import { GlobalSettings } from '../../../../components/theme/GlobalSettings';
import { DeviceToggle } from '../../../../components/theme/DeviceToggle';
import { ThemePreview } from '../../../../components/theme/ThemePreview';

interface Section {
  id: string;
  title: string;
  type: 'section' | 'element';
  visible: boolean;
  children?: Section[];
}

const sections: Section[] = [
  { id: 'pagina-inicial', title: 'Página inicial', type: 'section', visible: true },
  { id: 'header', title: 'Header', type: 'section', visible: true },
  { id: 'hero', title: 'Hero Section', type: 'section', visible: true },
  { id: 'modelo', title: 'Modelo', type: 'section', visible: true, children: [
    { id: 'carousel', title: 'Carousel', type: 'section', visible: true },
    { id: 'featured-products', title: 'Featured Products', type: 'section', visible: true },
    { id: 'newsletter', title: 'Newsletter', type: 'element', visible: true }
  ]},
  { id: 'footer', title: 'Footer', type: 'section', visible: true }
];

export const ThemeEditor: React.FC = () => {
  const navigate = useNavigate();
  const { updateTheme } = useTheme();
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [activeSection, setActiveSection] = useState<string>('header');
  const [activeSidebarTab, setActiveSidebarTab] = useState<'sections' | 'theme' | 'settings'>('sections');
  const [expandedSections, setExpandedSections] = useState<string[]>(['modelo']);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  const handleSave = useCallback(async () => {
    setSaveStatus('saving');
    // Save logic would go here
    setTimeout(() => setSaveStatus('success'), 1000);
  }, []);

  const handleSectionToggle = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleVisibilityToggle = (sectionId: string) => {
    // Handle section visibility toggle
    console.log('Toggle visibility for:', sectionId);
  };
  const renderSidebarContent = () => {
    switch (activeSidebarTab) {
      case 'sections':
        return (
          <SectionsList
            sections={sections}
            activeSection={activeSection}
            expandedSections={expandedSections}
            onSectionSelect={setActiveSection}
            onSectionToggle={handleSectionToggle}
            onVisibilityToggle={handleVisibilityToggle}
          />
        );
      case 'theme':
        return <GlobalSettings />;
      case 'settings':
        return <GlobalSettings />;
      default:
        return null;
    }
  };


  return (
    <div className="h-screen flex bg-[#f6f6f7]">
      {/* Unified Top Bar */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-50">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard/online-store')}
            className="text-gray-600 hover:text-gray-900 flex items-center"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            <span>Back to store</span>
          </button>
          <div className="h-6 w-px bg-gray-200" />
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="pl-9 pr-4 py-2 w-64 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <DeviceToggle viewMode={viewMode} onChange={setViewMode} />
          <button className="text-gray-600 hover:text-gray-900">
            <Eye className="w-5 h-5" />
          </button>
          <button
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {saveStatus === 'saving' ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex w-full mt-14">
        {/* Sidebar Icons */}
        <div className="w-12 bg-white border-r border-gray-200">
          <div className="flex flex-col items-center py-4 space-y-4">
            <button
              onClick={() => setActiveSidebarTab('sections')}
              className={`p-2 rounded-md ${
                activeSidebarTab === 'sections'
                  ? 'bg-gray-100 text-purple-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <LayoutTemplate className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveSidebarTab('theme')}
              className={`p-2 rounded-md ${
                activeSidebarTab === 'theme'
                  ? 'bg-gray-100 text-purple-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Palette className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveSidebarTab('settings')}
              className={`p-2 rounded-md ${
                activeSidebarTab === 'settings'
                  ? 'bg-gray-100 text-purple-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="w-64 bg-white border-r border-gray-200">
          {renderSidebarContent()}
        </div>

        {/* Preview Area */}
        <div className="flex-1 p-6">
          <ThemePreview viewMode={viewMode} tenantId="1" />
        </div>

        {/* Right Sidebar */}
        <div className="w-[300px] bg-white border-l border-gray-200 flex flex-col">
          <ThemeSettings activeSection={activeSection} />
        </div>
      </div>
    </div>
  );
};