import { useState } from 'react';
import { Monitor, Smartphone, Palette, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Theme {
  id: string;
  name: string;
  thumbnail: string;
  description: string;
}

const themes: Theme[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    thumbnail: '/themes/minimal.jpg',
    description: 'Um tema minimalista e elegante'
  },
  {
    id: 'modern',
    name: 'Modern',
    thumbnail: '/themes/modern.jpg',
    description: 'Design moderno e arrojado'
  },
  {
    id: 'classic',
    name: 'Classic',
    thumbnail: '/themes/classic.jpg',
    description: 'Estilo clássico e atemporal'
  }
];

export function Store() {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Loja Online</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-white rounded-lg shadow-sm p-1 border border-gray-200">
            <button
              onClick={() => setViewMode('desktop')}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'desktop'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Monitor className="w-4 h-4 mr-2" />
              Desktop
            </button>
            <button
              onClick={() => setViewMode('mobile')}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'mobile'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Smartphone className="w-4 h-4 mr-2" />
              Mobile
            </button>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              to={`/theme-editor/minimal`}
              className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              <Palette className="w-4 h-4 mr-2" />
              Editor de Tema
            </Link>
            <a
              href="/store/preview/minimal"
              target="_blank"
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Ver Loja
            </a>
          </div>
        </div>
      </div>

      {/* Preview Container */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="relative">
          {/* Desktop Preview */}
          <div 
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '6px',
              boxShadow: '0 0 0 2px #000',
            }}
          >
            <div className="bg-white overflow-hidden" style={{ borderRadius: '8px' }}>
              <iframe
                src="/store/preview/minimal"
                className="w-full h-[600px]"
                title="Desktop Preview"
              />
            </div>
          </div>

          {/* Mobile Preview Overlay */}
          <div 
            className="absolute right-[20%] bottom-2 w-[250px]"
            style={{
              background: 'white',
              borderRadius: '40px',
              padding: '6px',
              boxShadow: '0 0 0 2px #000',
            }}
          >
            {/* Notch do celular */}
            <div 
              style={{
                position: 'absolute',
                top: '6px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '90px',
                height: '18px',
                background: 'black',
                borderBottomLeftRadius: '10px',
                borderBottomRightRadius: '10px',
                zIndex: 10
              }}
            />
            {/* Tela do celular */}
            <div 
              className="overflow-hidden"
              style={{
                height: '450px',
                borderRadius: '35px',
              }}
            >
              <iframe
                src="/store/preview/minimal"
                className="w-full h-full"
                title="Mobile Preview"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Temas */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Temas Disponíveis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {themes.map((theme) => (
            <div
              key={theme.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:border-blue-500 transition-colors"
            >
              <div className="aspect-video bg-gray-100 relative">
                <img
                  src={theme.thumbnail}
                  alt={theme.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">{theme.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{theme.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <Link
                    to={`/theme-editor/${theme.id}`}
                    className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Palette className="w-4 h-4 mr-2" />
                    Personalizar Tema
                  </Link>
                  <button
                    onClick={() => {
                      // TODO: Implementar ativação do tema
                      alert('Em breve!');
                    }}
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    Ativar Tema
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}