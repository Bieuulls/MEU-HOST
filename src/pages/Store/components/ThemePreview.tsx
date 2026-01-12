import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import ThemePreviewFrame from './ThemePreviewFrame';

interface ThemePreviewProps {
  tenantId: string;
}

const ThemePreview: React.FC<ThemePreviewProps> = ({ tenantId }) => {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const port = '5173';
    const baseUrl = `http://localhost:${port}/preview/${tenantId}`;
    setPreviewUrl(baseUrl);

    const sendThemeSettings = async () => {
      try {
        setError(null);
        const response = await fetch(baseUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(theme),
        });

        if (!response.ok) {
          throw new Error(`Failed to update theme preview: ${response.statusText}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error updating theme preview';
        console.error('Theme preview error:', errorMessage);
        setError(errorMessage);
      }
    };

    if (theme) {
      sendThemeSettings();
    }
  }, [tenantId, theme]);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex items-center justify-center gap-4 p-4 bg-white border-b">
        <button
          className={`px-4 py-2 rounded-md transition-colors ${viewMode === 'desktop' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
          onClick={() => setViewMode('desktop')}
          aria-pressed={viewMode === 'desktop'}
        >
          Desktop
        </button>
        <button
          className={`px-4 py-2 rounded-md transition-colors ${viewMode === 'mobile' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
          onClick={() => setViewMode('mobile')}
          aria-pressed={viewMode === 'mobile'}
        >
          Mobile
        </button>
      </div>
      {error && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
          {error}
        </div>
      )}
      <div className="flex-1 flex items-center justify-center p-4">
        <ThemePreviewFrame previewUrl={previewUrl} viewMode={viewMode} />
      </div>
    </div>
  );
};

export default ThemePreview;