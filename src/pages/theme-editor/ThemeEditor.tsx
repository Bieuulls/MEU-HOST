import { useTheme } from '../../contexts/ThemeContext';
import { useState } from 'react';
import { ChevronDown, ChevronRight, Layout, Type, Palette, Monitor, Smartphone, Tablet } from 'lucide-react';
import { StorePreview } from '../store/preview/StorePreview';
import styled from 'styled-components';

type DeviceType = 'desktop' | 'tablet' | 'mobile';

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const Sidebar = styled.div`
  width: 100%;
  height: 320px;
  overflow-y: auto;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  
  @media (min-width: 768px) {
    width: 320px;
    height: 100vh;
    border-right: 1px solid #e5e7eb;
    border-bottom: none;
  }

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const PreviewContainer = styled.div<{ $previewMode: DeviceType }>`
  flex: 1;
  height: calc(100vh - 320px);
  overflow: hidden;
  background: #f9fafb;
  position: relative;
  
  @media (min-width: 768px) {
    height: 100vh;
  }
  
  .preview-content {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    overflow: auto;
    max-width: ${props => 
      props.$previewMode === 'mobile' ? '375px' : 
      props.$previewMode === 'tablet' ? '768px' : '100%'
    };
    transition: max-width 0.3s ease;
  }

  /* Custom scrollbar */
  .preview-content::-webkit-scrollbar {
    width: 6px;
  }

  .preview-content::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  .preview-content::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }

  .preview-content::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const DeviceSelector = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const DeviceButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  background: ${props => props.$active ? '#e5e7eb' : 'transparent'};
  color: ${props => props.$active ? '#111827' : '#6b7280'};
  font-size: 0.875rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.$active ? '#e5e7eb' : '#f3f4f6'};
  }

  @media (max-width: 640px) {
    padding: 0.5rem;
    
    span {
      display: none;
    }
  }
`;

const Section = styled.div`
  border-bottom: 1px solid #e5e7eb;
  background: white;
`;

const SectionHeader = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: white;
  font-weight: 500;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: #f9fafb;
  }
`;

const SectionContent = styled.div`
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
  background: white;
`;

const ColorInput = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;

  input[type="color"] {
    -webkit-appearance: none;
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 4px;
    padding: 0;
    cursor: pointer;

    &::-webkit-color-swatch-wrapper {
      padding: 0;
    }
    
    &::-webkit-color-swatch {
      border: none;
      border-radius: 4px;
    }
  }

  .color-input-text {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid #e5e7eb;
    border-radius: 4px;
    font-family: monospace;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  background-color: white;
  font-size: 0.875rem;
  color: #374151;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    ring: 2px solid #bfdbfe;
  }
`;

export function ThemeEditor() {
  const { currentTheme, updateTheme } = useTheme();
  const [expandedSections, setExpandedSections] = useState<string[]>(['colors', 'typography', 'menu']);
  const [previewMode, setPreviewMode] = useState<DeviceType>('desktop');

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleColorChange = (colorKey: string, value: string) => {
    updateTheme({
      colors: {
        ...currentTheme.colors,
        [colorKey]: value
      }
    });
  };

  const handleMenuChange = (value: string) => {
    updateTheme({
      menu: {
        ...currentTheme.menu,
        type: value as 'default' | 'centered' | 'minimal' | 'fullwidth' | 'sidebar'
      }
    });
  };

  const handleFontChange = (fontType: 'body' | 'heading', value: string) => {
    updateTheme({
      typography: {
        ...currentTheme.typography,
        fonts: {
          ...currentTheme.typography.fonts,
          [fontType]: value
        }
      }
    });
  };

  return (
    <EditorContainer>
      <Sidebar>
        <DeviceSelector>
          <DeviceButton
            $active={previewMode === 'desktop'}
            onClick={() => setPreviewMode('desktop')}
          >
            <Monitor size={16} />
            <span>Desktop</span>
          </DeviceButton>
          <DeviceButton
            $active={previewMode === 'tablet'}
            onClick={() => setPreviewMode('tablet')}
          >
            <Tablet size={16} />
            <span>Tablet</span>
          </DeviceButton>
          <DeviceButton
            $active={previewMode === 'mobile'}
            onClick={() => setPreviewMode('mobile')}
          >
            <Smartphone size={16} />
            <span>Mobile</span>
          </DeviceButton>
        </DeviceSelector>

        <div>
          {/* Colors Section */}
          <Section>
            <SectionHeader onClick={() => toggleSection('colors')}>
              <div className="flex items-center gap-2">
                <Palette size={16} />
                <span>Cores</span>
              </div>
              {expandedSections.includes('colors') ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </SectionHeader>
            
            {expandedSections.includes('colors') && (
              <SectionContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Cor Primária</label>
                    <ColorInput>
                      <input
                        type="color"
                        value={currentTheme.colors.primary}
                        onChange={(e) => handleColorChange('primary', e.target.value)}
                      />
                      <input
                        type="text"
                        value={currentTheme.colors.primary}
                        onChange={(e) => handleColorChange('primary', e.target.value)}
                        className="color-input-text"
                      />
                    </ColorInput>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Cor Secundária</label>
                    <ColorInput>
                      <input
                        type="color"
                        value={currentTheme.colors.secondary}
                        onChange={(e) => handleColorChange('secondary', e.target.value)}
                      />
                      <input
                        type="text"
                        value={currentTheme.colors.secondary}
                        onChange={(e) => handleColorChange('secondary', e.target.value)}
                        className="color-input-text"
                      />
                    </ColorInput>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Cor Terciária</label>
                    <ColorInput>
                      <input
                        type="color"
                        value={currentTheme.colors.tertiary}
                        onChange={(e) => handleColorChange('tertiary', e.target.value)}
                      />
                      <input
                        type="text"
                        value={currentTheme.colors.tertiary}
                        onChange={(e) => handleColorChange('tertiary', e.target.value)}
                        className="color-input-text"
                      />
                    </ColorInput>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Cor de Destaque</label>
                    <ColorInput>
                      <input
                        type="color"
                        value={currentTheme.colors.accent}
                        onChange={(e) => handleColorChange('accent', e.target.value)}
                      />
                      <input
                        type="text"
                        value={currentTheme.colors.accent}
                        onChange={(e) => handleColorChange('accent', e.target.value)}
                        className="color-input-text"
                      />
                    </ColorInput>
                  </div>
                </div>
              </SectionContent>
            )}
          </Section>

          {/* Typography Section */}
          <Section>
            <SectionHeader onClick={() => toggleSection('typography')}>
              <div className="flex items-center gap-2">
                <Type size={16} />
                <span>Tipografia</span>
              </div>
              {expandedSections.includes('typography') ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </SectionHeader>
            
            {expandedSections.includes('typography') && (
              <SectionContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Fonte Principal</label>
                    <Select
                      value={currentTheme.typography.fonts.body}
                      onChange={(e) => handleFontChange('body', e.target.value)}
                    >
                      <option value="'Inter', sans-serif">Inter</option>
                      <option value="'Roboto', sans-serif">Roboto</option>
                      <option value="'Open Sans', sans-serif">Open Sans</option>
                      <option value="'Montserrat', sans-serif">Montserrat</option>
                      <option value="'Poppins', sans-serif">Poppins</option>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Fonte de Títulos</label>
                    <Select
                      value={currentTheme.typography.fonts.heading}
                      onChange={(e) => handleFontChange('heading', e.target.value)}
                    >
                      <option value="'Inter', sans-serif">Inter</option>
                      <option value="'Roboto', sans-serif">Roboto</option>
                      <option value="'Open Sans', sans-serif">Open Sans</option>
                      <option value="'Montserrat', sans-serif">Montserrat</option>
                      <option value="'Poppins', sans-serif">Poppins</option>
                    </Select>
                  </div>
                </div>
              </SectionContent>
            )}
          </Section>

          {/* Menu Section */}
          <Section>
            <SectionHeader onClick={() => toggleSection('menu')}>
              <div className="flex items-center gap-2">
                <Layout size={16} />
                <span>Menu</span>
              </div>
              {expandedSections.includes('menu') ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </SectionHeader>
            
            {expandedSections.includes('menu') && (
              <SectionContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Estilo do Menu</label>
                    <Select
                      value={currentTheme.menu.type}
                      onChange={(e) => handleMenuChange(e.target.value)}
                    >
                      <option value="default">Menu Padrão</option>
                      <option value="centered">Menu Centralizado</option>
                      <option value="minimal">Menu Minimalista</option>
                      <option value="fullwidth">Menu Largura Total</option>
                      <option value="sidebar">Menu Lateral</option>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Cor do Fundo</label>
                    <ColorInput>
                      <input
                        type="color"
                        value={currentTheme.menu.background}
                        onChange={(e) => updateTheme({
                          menu: {
                            ...currentTheme.menu,
                            background: e.target.value
                          }
                        })}
                      />
                      <input
                        type="text"
                        value={currentTheme.menu.background}
                        onChange={(e) => updateTheme({
                          menu: {
                            ...currentTheme.menu,
                            background: e.target.value
                          }
                        })}
                        className="color-input-text"
                      />
                    </ColorInput>
                  </div>
                </div>
              </SectionContent>
            )}
          </Section>
        </div>
      </Sidebar>

      <PreviewContainer $previewMode={previewMode}>
        <div className="preview-content">
          <StorePreview />
        </div>
      </PreviewContainer>
    </EditorContainer>
  );
}
