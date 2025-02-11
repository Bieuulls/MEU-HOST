import { Section } from './types';
import { Palette, Type, Layout, Image, Navigation } from 'lucide-react';

export const defaultSections: Section[] = [
  {
    id: 'colors',
    name: 'Cores',
    icon: Palette,
    settings: [
      {
        id: 'primary',
        label: 'Cor Primária',
        type: 'color',
        value: '#0066FF'
      },
      {
        id: 'secondary',
        label: 'Cor Secundária',
        type: 'color',
        value: '#00CC88'
      },
      {
        id: 'background',
        label: 'Fundo',
        type: 'color',
        value: '#FFFFFF'
      },
      {
        id: 'text',
        label: 'Texto',
        type: 'color',
        value: '#1A1A1A'
      }
    ]
  },
  {
    id: 'typography',
    name: 'Tipografia',
    icon: Type,
    settings: [
      {
        id: 'headingFont',
        label: 'Fonte dos Títulos',
        type: 'select',
        value: 'inter',
        options: [
          { label: 'Inter', value: 'inter' },
          { label: 'Roboto', value: 'roboto' },
          { label: 'Poppins', value: 'poppins' }
        ]
      },
      {
        id: 'bodyFont',
        label: 'Fonte do Corpo',
        type: 'select',
        value: 'inter',
        options: [
          { label: 'Inter', value: 'inter' },
          { label: 'Roboto', value: 'roboto' },
          { label: 'Poppins', value: 'poppins' }
        ]
      },
      {
        id: 'baseSize',
        label: 'Tamanho Base (px)',
        type: 'number',
        value: '16'
      }
    ]
  },
  {
    id: 'layout',
    name: 'Layout',
    icon: Layout,
    settings: [
      {
        id: 'containerWidth',
        label: 'Largura do Container (px)',
        type: 'number',
        value: '1200'
      },
      {
        id: 'spacing',
        label: 'Espaçamento Base (px)',
        type: 'number',
        value: '16'
      }
    ]
  },
  {
    id: 'header',
    name: 'Cabeçalho',
    icon: Navigation,
    settings: [
      {
        id: 'logo',
        label: 'URL do Logo',
        type: 'text',
        value: '/logo.png'
      },
      {
        id: 'menuAlignment',
        label: 'Alinhamento do Menu',
        type: 'select',
        value: 'center',
        options: [
          { label: 'Esquerda', value: 'left' },
          { label: 'Centro', value: 'center' },
          { label: 'Direita', value: 'right' }
        ]
      }
    ]
  },
  {
    id: 'hero',
    name: 'Banner Principal',
    icon: Image,
    settings: [
      {
        id: 'backgroundImage',
        label: 'Imagem de Fundo',
        type: 'text',
        value: '/hero-bg.jpg'
      },
      {
        id: 'heading',
        label: 'Título',
        type: 'text',
        value: 'Bem-vindo à nossa loja'
      },
      {
        id: 'subheading',
        label: 'Subtítulo',
        type: 'text',
        value: 'Encontre os melhores produtos aqui'
      }
    ]
  }
];
