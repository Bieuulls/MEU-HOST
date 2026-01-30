import React from 'react';
import { ThemePreview } from './components/ThemePreview';
import { ThemeHeader } from './components/ThemeHeader';
import { ThemeLibrary } from './components/ThemeLibrary';

export const OnlineStore: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <ThemeHeader />
      <ThemePreview />
      <ThemeLibrary />
    </div>
  );
};
