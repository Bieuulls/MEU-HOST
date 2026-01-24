import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  ChevronLeft,
  Monitor,
  Smartphone,
  Eye,
  Save,
  AlertCircle,
  Check,
  Layout,
  Box
} from 'lucide-react';
import { useTheme, ThemeSettings } from '../../../contexts/ThemeContext';
import { Preview } from '../../Store/components/Preview';

interface Section {
  id: string;
  title: string;
  icon?: React.ElementType;
  children?: Section[];
  editable?: boolean;
  type?: 'section' | 'mail' | 'plus';
}

export const ThemeEditor: React.FC = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>(['modelo']);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const { theme, updateTheme } = useTheme();

  const handleSave = async () => {
    if (!activeSection) return;

    try {
      setSaveStatus('saving');
      await updateTheme(activeSection as keyof ThemeSettings, theme[activeSection as keyof ThemeSettings]);
      setSaveStatus('success');
    } catch (error) {
      console.error('Error saving theme:', error);
      setSaveStatus('error');
    }
  };

  const handlePublish = async () => {
    try {
      setSaveStatus('saving');
      await updateTheme('header', {}); // Use a valid section instead of 'publish'
      setSaveStatus('success');
    } catch (error) {
      console.error('Error publishing theme:', error);
      setSaveStatus('error');
    }
  };

  const sections: Section[] = [
    {
      id: 'pagina-inicial',
      title: 'Página inicial',
      icon: Layout
    },
    {
      id: 'barra-topo',
      title: 'Barra do topo',
      icon: Box,
      children: [
        {
          id: 'topbar-settings',
          title: 'Configurações',
          children: [
            { id: 'show-topbar', title: 'Mostrar barra do topo' },
            { id: 'topbar-bg', title: 'Cor de fundo' },
            { id: 'topbar-text', title: 'Cor do texto' },
          ]
        }
      ]
    }
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const renderSection = (section: Section, level: number = 0) => {
    const isExpanded = expandedSections.includes(section.id);
    const hasChildren = section.children && section.children.length > 0;
    const Icon = section.icon;

    return (
      <div key={section.id}>
        <button
          onClick={() => {
            toggleSection(section.id);
            setActiveSection(section.id);
          }}
          className={`
            w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-50
            ${level > 0 ? 'pl-8' : ''}
            ${activeSection === section.id ? 'bg-gray-100' : ''}
          `}
        >
          <div className="flex items-center gap-3">
            {Icon && <Icon className="w-4 h-4 text-gray-500" />}
            <span className="text-gray-700">{section.title}</span>
          </div>
          {hasChildren && (
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform ${
                isExpanded ? 'transform rotate-180' : ''
              }`}
            />
          )}
        </button>
        {hasChildren && isExpanded && (
          <div className="border-l border-gray-200 ml-4">
            {section.children!.map(child => renderSection(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-screen flex bg-[#1a1a1a]">
      {/* Unified Header */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-white border-b flex items-center justify-between px-4 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard/online-store')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            <span>Back to store</span>
          </button>
          <div className="h-6 w-px bg-gray-200" />
          <button
            onClick={() => setViewMode('desktop')}
            className={`p-2 rounded-md ${viewMode === 'desktop' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900'}`}
            title="Desktop view"
          >
            <Monitor className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('mobile')}
            className={`p-2 rounded-md ${viewMode === 'mobile' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900'}`}
            title="Mobile view"
          >
            <Smartphone className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.open('/store', '_blank')}
            className="flex items-center text-gray-600 hover:text-gray-900"
            title="Preview store"
          >
            <Eye className="w-5 h-5 mr-2" />
            <span>Preview</span>
          </button>
          <div className="h-6 w-px bg-gray-200" />
          <button
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className="flex items-center text-gray-600 hover:text-gray-900"
            title="Save changes"
          >
            <Save className="w-5 h-5 mr-2" />
            <span>{saveStatus === 'saving' ? 'Saving...' : 'Save'}</span>
          </button>
          <button
            onClick={handlePublish}
            disabled={saveStatus === 'saving'}
            className="flex items-center text-gray-600 hover:text-gray-900"
            title="Publish changes"
          >
            <Eye className="w-5 h-5 mr-2" />
            <span>{saveStatus === 'saving' ? 'Publishing...' : 'Publish'}</span>
          </button>
        </div>
      </div>

      {/* Left Sidebar */}
      <div className="w-64 flex flex-col bg-white border-r mt-14">
        <div className="flex-1 overflow-y-auto">
          {sections.map(section => renderSection(section))}
        </div>
      </div>

      {/* Preview */}
      <div className="flex-1 bg-gray-50 flex flex-col mt-14">
        <div className="flex-1">
          <Preview viewMode={viewMode} url="/store" />
        </div>
      </div>
    </div>
  );
};