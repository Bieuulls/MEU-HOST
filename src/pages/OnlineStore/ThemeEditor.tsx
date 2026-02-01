import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface Section {
  id: string;
  title: string;
  children?: Section[];
}

export const ThemeEditor: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const sections: Section[] = [
    { id: 'page-settings', title: 'Página inicial' },
    { id: 'top-bar', title: 'Barra do topo' },
    { id: 'nav-bar', title: 'Barra de navegação' },
    {
      id: 'model',
      title: 'Modelo',
      children: [
        { id: 'carousel', title: 'Carrossel' },
        { id: 'collections-carousel', title: 'Coleções em Carrossel' },
        { id: 'daily-deals', title: 'Escassez diária' },
        { id: 'featured-collection', title: 'Coleção em destaque' },
        { id: 'orbeecom-convertex', title: 'OrbeEcom - ConverteX' },
        { id: 'separator', title: 'Separador' },
        { id: 'instagram-gallery', title: 'Galeria do Instagram' },
        { id: 'newsletter', title: 'Newsletter' }
      ]
    },
    { id: 'footer', title: 'Footer' }
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const renderSection = (section: Section) => {
    const isExpanded = expandedSections.includes(section.id);
    const hasChildren = section.children && section.children.length > 0;

    return (
      <div key={section.id} className="mb-1">
        <button
          onClick={() => toggleSection(section.id)}
          className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          <span>{section.title}</span>
          {hasChildren && (
            <span className="text-gray-400">
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </span>
          )}
        </button>
        {hasChildren && isExpanded && (
          <div className="ml-4">
            {section.children!.map(child => renderSection(child))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Editor de tema</h2>
        <div className="space-y-1">
          {sections.map(section => renderSection(section))}
        </div>
      </div>
    </div>
  );
};