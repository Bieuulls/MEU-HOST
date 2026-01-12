import React from 'react';
import { ChevronDown, ChevronRight, Eye, EyeOff } from 'lucide-react';

interface Section {
  id: string;
  title: string;
  type: 'section' | 'element';
  visible: boolean;
  children?: Section[];
}

interface SectionsListProps {
  sections: Section[];
  activeSection: string;
  expandedSections: string[];
  onSectionSelect: (sectionId: string) => void;
  onSectionToggle: (sectionId: string) => void;
  onVisibilityToggle: (sectionId: string) => void;
}

export const SectionsList: React.FC<SectionsListProps> = ({
  sections,
  activeSection,
  expandedSections,
  onSectionSelect,
  onSectionToggle,
  onVisibilityToggle,
}) => {
  const renderSection = (section: Section, level: number = 0) => {
    const isExpanded = expandedSections.includes(section.id);
    const hasChildren = section.children && section.children.length > 0;
    const isActive = activeSection === section.id;

    return (
      <div key={section.id}>
        <div
          className={`
            flex items-center justify-between px-3 py-2 text-sm rounded-md cursor-pointer
            ${level > 0 ? 'ml-4' : ''}
            ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}
          `}
          onClick={() => onSectionSelect(section.id)}
        >
          <div className="flex items-center flex-1">
            {hasChildren && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSectionToggle(section.id);
                }}
                className="mr-2 p-1 hover:bg-gray-200 rounded"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            )}
            <span className={hasChildren ? '' : 'ml-6'}>{section.title}</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onVisibilityToggle(section.id);
            }}
            className="p-1 hover:bg-gray-200 rounded"
          >
            {section.visible ? (
              <Eye className="w-4 h-4 text-gray-500" />
            ) : (
              <EyeOff className="w-4 h-4 text-gray-400" />
            )}
          </button>
        </div>
        {hasChildren && isExpanded && (
          <div className="mt-1">
            {section.children!.map(child => renderSection(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-1">
      {sections.map(section => renderSection(section))}
    </div>
  );
};