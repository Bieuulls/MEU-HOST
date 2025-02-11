import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import styled from 'styled-components';

const EditorContainer = styled.div`
  padding: 2rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1a202c;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #4a5568;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: #0066cc;
    box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background-color: white;

  &:focus {
    outline: none;
    border-color: #0066cc;
    box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.1);
  }
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background: #0066cc;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #0052a3;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.1);
  }
`;

export function ThemeEditor() {
  const { currentTheme, updateTheme, resetTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('menu');

  const handleMenuUpdate = (updates: any) => {
    updateTheme({
      menu: {
        ...currentTheme.menu,
        ...updates
      }
    });
  };

  const handleHeaderUpdate = (updates: any) => {
    updateTheme({
      header: {
        ...currentTheme.header,
        ...updates
      }
    });
  };

  const handleColorsUpdate = (updates: any) => {
    updateTheme({
      colors: {
        ...currentTheme.colors,
        ...updates
      }
    });
  };

  return (
    <EditorContainer>
      <div style={{ marginBottom: '2rem' }}>
        <Button onClick={() => resetTheme()}>Restaurar Tema Padrão</Button>
      </div>

      <Section>
        <SectionTitle>Menu</SectionTitle>
        <Grid>
          <FormGroup>
            <Label>Estilo do Menu</Label>
            <Select
              value={currentTheme.menu.type}
              onChange={(e) => handleMenuUpdate({ type: e.target.value })}
            >
              <option value="default">Padrão</option>
              <option value="centered">Centralizado</option>
              <option value="minimal">Minimalista</option>
              <option value="fullwidth">Largura Total</option>
              <option value="sidebar">Barra Lateral</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Cor de Fundo</Label>
            <Input
              type="color"
              value={currentTheme.menu.background}
              onChange={(e) => handleMenuUpdate({ background: e.target.value })}
            />
          </FormGroup>

          <FormGroup>
            <Label>Cor do Texto</Label>
            <Input
              type="color"
              value={currentTheme.menu.textColor}
              onChange={(e) => handleMenuUpdate({ textColor: e.target.value })}
            />
          </FormGroup>

          <FormGroup>
            <Label>Cor do Hover</Label>
            <Input
              type="color"
              value={currentTheme.menu.hoverColor}
              onChange={(e) => handleMenuUpdate({ hoverColor: e.target.value })}
            />
          </FormGroup>

          <FormGroup>
            <Label>Altura do Menu</Label>
            <Input
              type="text"
              value={currentTheme.menu.height}
              onChange={(e) => handleMenuUpdate({ height: e.target.value })}
            />
          </FormGroup>

          <FormGroup>
            <Label>Posição do Logo</Label>
            <Select
              value={currentTheme.menu.logoPosition}
              onChange={(e) => handleMenuUpdate({ logoPosition: e.target.value })}
            >
              <option value="left">Esquerda</option>
              <option value="center">Centro</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Posição da Busca</Label>
            <Select
              value={currentTheme.menu.searchPosition}
              onChange={(e) => handleMenuUpdate({ searchPosition: e.target.value })}
            >
              <option value="left">Esquerda</option>
              <option value="center">Centro</option>
              <option value="right">Direita</option>
            </Select>
          </FormGroup>
        </Grid>
      </Section>

      <Section>
        <SectionTitle>Cabeçalho</SectionTitle>
        <Grid>
          <FormGroup>
            <Label>Posição</Label>
            <Select
              value={currentTheme.header.position}
              onChange={(e) => handleHeaderUpdate({ position: e.target.value })}
            >
              <option value="static">Estático</option>
              <option value="fixed">Fixo</option>
              <option value="sticky">Grudento</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Mostrar Barra Superior</Label>
            <Select
              value={currentTheme.header.topBar.enabled.toString()}
              onChange={(e) => handleHeaderUpdate({
                topBar: {
                  ...currentTheme.header.topBar,
                  enabled: e.target.value === 'true'
                }
              })}
            >
              <option value="true">Sim</option>
              <option value="false">Não</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Cor de Fundo da Barra Superior</Label>
            <Input
              type="color"
              value={currentTheme.header.topBar.background}
              onChange={(e) => handleHeaderUpdate({
                topBar: {
                  ...currentTheme.header.topBar,
                  background: e.target.value
                }
              })}
            />
          </FormGroup>

          <FormGroup>
            <Label>Mensagem da Barra Superior</Label>
            <Input
              type="text"
              value={currentTheme.header.topBar.message}
              onChange={(e) => handleHeaderUpdate({
                topBar: {
                  ...currentTheme.header.topBar,
                  message: e.target.value
                }
              })}
            />
          </FormGroup>
        </Grid>
      </Section>

      <Section>
        <SectionTitle>Cores</SectionTitle>
        <Grid>
          <FormGroup>
            <Label>Cor Primária</Label>
            <Input
              type="color"
              value={currentTheme.colors.primary}
              onChange={(e) => handleColorsUpdate({ primary: e.target.value })}
            />
          </FormGroup>

          <FormGroup>
            <Label>Cor Secundária</Label>
            <Input
              type="color"
              value={currentTheme.colors.secondary}
              onChange={(e) => handleColorsUpdate({ secondary: e.target.value })}
            />
          </FormGroup>

          <FormGroup>
            <Label>Cor de Destaque</Label>
            <Input
              type="color"
              value={currentTheme.colors.accent}
              onChange={(e) => handleColorsUpdate({ accent: e.target.value })}
            />
          </FormGroup>

          <FormGroup>
            <Label>Cor de Fundo</Label>
            <Input
              type="color"
              value={currentTheme.colors.background}
              onChange={(e) => handleColorsUpdate({ background: e.target.value })}
            />
          </FormGroup>

          <FormGroup>
            <Label>Cor do Texto</Label>
            <Input
              type="color"
              value={currentTheme.colors.text}
              onChange={(e) => handleColorsUpdate({ text: e.target.value })}
            />
          </FormGroup>
        </Grid>
      </Section>
    </EditorContainer>
  );
}
