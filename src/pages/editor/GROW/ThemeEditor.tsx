import { useState, useEffect, useRef } from 'react';
import { Save, Eye, Monitor, Smartphone, Palette, Type, Layout } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Setting {
  id: string;
  label: string;
  type: 'text' | 'color' | 'select' | 'number';
  value: string;
  options?: string[];
}

interface Section {
  id: string;
  name: string;
  icon: any;
  settings: Setting[];
}

const defaultSections: Section[] = [
  {
    id: 'typography',
    name: 'Tipografia',
    icon: Type,
    settings: [
      {
        id: 'fontFamily',
        label: 'Fonte Principal',
        type: 'select',
        value: 'Inter',
        options: ['Inter', 'Roboto', 'Open Sans', 'Lato']
      },
      {
        id: 'baseSize',
        label: 'Tamanho Base',
        type: 'text',
        value: '16px'
      },
      {
        id: 'titleColor',
        label: 'Cor dos Títulos',
        type: 'color',
        value: '#1a1a1a'
      },
      {
        id: 'textColor',
        label: 'Cor do Texto',
        type: 'color',
        value: '#4a4a4a'
      }
    ]
  },
  {
    id: 'layout',
    name: 'Layout',
    icon: Layout,
    settings: [
      {
        id: 'maxWidth',
        label: 'Largura Máxima',
        type: 'text',
        value: '1200px'
      },
      {
        id: 'spacing',
        label: 'Espaçamento',
        type: 'text',
        value: '1rem'
      },
      {
        id: 'backgroundColor',
        label: 'Cor de Fundo',
        type: 'color',
        value: '#ffffff'
      }
    ]
  },
  {
    id: 'colors',
    name: 'Cores',
    icon: Palette,
    settings: [
      {
        id: 'primary',
        label: 'Cor Primária',
        type: 'color',
        value: '#3b82f6'
      },
      {
        id: 'secondary',
        label: 'Cor Secundária',
        type: 'color',
        value: '#6b7280'
      },
      {
        id: 'background',
        label: 'Cor de Fundo',
        type: 'color',
        value: '#f3f4f6'
      }
    ]
  }
];

export function ThemeEditor() {
  const [activeSection, setActiveSection] = useState(defaultSections[0]);
  const [settings, setSettings] = useState(defaultSections);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [iframeError, setIframeError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Handle iframe communication errors
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'IFRAME_ERROR') {
        setIframeError(event.data.error);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Envia as configurações para o iframe quando elas mudam
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    let isMounted = true;
    let messageTimeout: NodeJS.Timeout;

    const sendConfig = () => {
      if (!isMounted || !iframe.contentWindow) return;

      try {
        const config = settings.reduce((acc, section) => {
          acc[section.id] = section.settings.reduce((settingAcc, setting) => {
            settingAcc[setting.id] = setting.value;
            return settingAcc;
          }, {} as any);
          return acc;
        }, {} as any);

        iframe.contentWindow.postMessage({
          type: 'THEME_UPDATE',
          config
        }, '*');

        setIframeError(null);
      } catch (error) {
        console.error('Error posting message to iframe:', error);
        setIframeError('Erro ao atualizar o tema. Por favor, tente novamente.');
      }
    };

    const handleIframeLoad = () => {
      if (messageTimeout) clearTimeout(messageTimeout);
      messageTimeout = setTimeout(sendConfig, 100);
    };

    iframe.addEventListener('load', handleIframeLoad);
    
    if (iframe.contentDocument?.readyState === 'complete') {
      handleIframeLoad();
    }

    return () => {
      isMounted = false;
      if (messageTimeout) clearTimeout(messageTimeout);
      iframe.removeEventListener('load', handleIframeLoad);
    };
  }, [settings]);

  const handleSettingChange = (sectionId: string, settingId: string, value: string) => {
    setSettings(prev =>
      prev.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            settings: section.settings.map(setting => {
              if (setting.id === settingId) {
                return { ...setting, value };
              }
              return setting;
            })
          };
        }
        return section;
      })
    );
  };

  // Display error if iframe communication fails
  if (iframeError) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-red-50">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-red-600 text-xl font-bold mb-4">Erro</h2>
          <p className="text-gray-700">{iframeError}</p>
          <button 
            onClick={() => setIframeError(null)}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  const renderSettingInput = (setting: Setting) => {
    switch (setting.type) {
      case 'color':
        return (
          <div className="flex items-center gap-2">
            <input
              type="color"
              id={setting.id}
              value={setting.value}
              onChange={(e) => handleSettingChange(activeSection.id, setting.id, e.target.value)}
              className="w-8 h-8 rounded-md border border-gray-200"
            />
            <input
              type="text"
              value={setting.value}
              onChange={(e) => handleSettingChange(activeSection.id, setting.id, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
        );
      case 'select':
        return (
          <select
            id={setting.id}
            value={setting.value}
            onChange={(e) => handleSettingChange(activeSection.id, setting.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            {setting.options?.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      default:
        return (
          <input
            type="text"
            id={setting.id}
            value={setting.value}
            onChange={(e) => handleSettingChange(activeSection.id, setting.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar de configurações */}
      <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-gray-800">Editor de Tema</h1>
            <button
              onClick={() => window.history.back()}
              className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
            >
              Voltar
            </button>
          </div>

          <nav className="space-y-1">
            {defaultSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section)}
                className={`flex items-center w-full px-3 py-2 text-sm rounded-md ${
                  activeSection.id === section.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <section.icon className="w-5 h-5 mr-3" />
                {section.name}
              </button>
            ))}
          </nav>

          <div className="mt-6">
            <div className="border-t border-gray-200 pt-6">
              {activeSection.settings.map((setting) => (
                <div key={setting.id} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {setting.label}
                  </label>
                  {renderSettingInput(setting)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Área de preview */}
      <div className="flex-1 bg-gray-50">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setViewMode('desktop')}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  viewMode === 'desktop'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Monitor className="w-4 h-4 mr-2" />
                Desktop
              </button>
              <button
                onClick={() => setViewMode('mobile')}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  viewMode === 'mobile'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Smartphone className="w-4 h-4 mr-2" />
                Mobile
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <Link
                to="/store/preview"
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                target="_blank"
              >
                <Eye className="w-4 h-4 mr-2" />
                Visualizar
              </Link>
              <button
                onClick={() => {
                  // TODO: Implementar salvamento
                  alert('Tema salvo com sucesso!');
                }}
                className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className={`mx-auto ${
              viewMode === 'mobile' ? 'max-w-sm' : 'max-w-6xl'
            }`}>
              <div className="bg-gray-800 rounded-lg p-2">
                <div className="bg-white rounded-sm overflow-hidden">
                  <iframe
                    ref={iframeRef}
                    src="/store/preview"
                    className="w-full h-[calc(100vh-12rem)]"
                    title="Theme Preview"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}