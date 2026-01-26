import React from 'react';
import { EyeOff } from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

interface Section {
  id: string;
  title: string;
  type: 'section' | 'element';
  children?: Section[];
}

const sections: Section[] = [
  {
    id: 'pagina-inicial',
    title: 'Página inicial',
    type: 'section'
  },
  {
    id: 'header',
    title: 'Barra do topo',
    type: 'section'
  },
  {
    id: 'barra-navegacao',
    title: 'Barra de navegação',
    type: 'section'
  },
  {
    id: 'modelo',
    title: 'Modelo',
    type: 'section',
    children: [
      { id: 'carrossel', title: 'Carrossel', type: 'section' },
      { id: 'colecoes-carrossel', title: 'Coleções em Carrossel', type: 'section' },
      { id: 'escassez-diaria', title: 'Escassez diária', type: 'section' },
      { id: 'colecao-destaque', title: 'Coleção em destaque', type: 'section' },
      { id: 'orbeecom-convertex', title: 'OrbeEcom - ConverteX', type: 'section' },
      { id: 'separador', title: 'Separador', type: 'section' },
      { id: 'galeria-instagram', title: 'Galeria do Instagram', type: 'section' },
      { id: 'newsletter', title: 'Newsletter', type: 'element' }
    ]
  },
  {
    id: 'adicionar-secao',
    title: 'Adicionar seção',
    type: 'section'
  },
  {
    id: 'barra-informacoes',
    title: 'Barra de informações',
    type: 'section'
  },
  {
    id: 'footer',
    title: 'Footer',
    type: 'section'
  },
  {
    id: 'sticky-newsletter',
    title: 'Sticky newsletter',
    type: 'element'
  }
];

export const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection }) => {
  return (
    <div className="w-64 bg-white border-r border-gray-200">
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-1">
          {sections.map((section) => (
            <div key={section.id}>
              <button
                onClick={() => setActiveSection(section.id)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                  activeSection === section.id
                    ? 'bg-[#f6f6f7] text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {section.title}
              </button>
              {section.children && activeSection === section.id && (
                <div className="ml-4 mt-1 space-y-1">
                  {section.children.map((child) => (
                    <button
                      key={child.id}
                      onClick={() => setActiveSection(child.id)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md"
                    >
                      {child.title}
                      {child.type === 'element' && (
                        <EyeOff className="float-right w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};