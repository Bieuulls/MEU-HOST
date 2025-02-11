import { LucideIcon } from 'lucide-react';

export interface Setting {
  id: string;
  label: string;
  type: 'color' | 'text' | 'select' | 'number';
  value: string;
  options?: { label: string; value: string }[];
}

export interface Section {
  id: string;
  name: string;
  icon: LucideIcon;
  settings: Setting[];
}

export interface ThemeConfig {
  [key: string]: {
    [key: string]: string;
  };
}
