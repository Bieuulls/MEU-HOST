import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface ThemePreviewProps {
  viewMode: 'desktop' | 'mobile';
  tenantId: string;
}

export const ThemePreview: React.FC<ThemePreviewProps> = ({ viewMode, tenantId }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const updatePreview = async () => {
      try {
        setError(null);
        const response = await fetch(`http://localhost:3001/preview/${tenantId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(theme),
        });

        if (!response.ok) {
          throw new Error('Failed to update preview');
        }

        if (iframeRef.current) {
          iframeRef.current.src = `http://localhost:3001/preview/${tenantId}?t=${Date.now()}`;
        }
      } catch (err) {
        console.error('Preview update error:', err);
        setError('Failed to update preview');
      }
    };

    if (theme) {
      updatePreview();
    }
  }, [theme, tenantId]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const frameStyles = {
    desktop: {
      width: '100%',
      height: 'calc(100vh - 120px)',
      border: 'none',
      borderRadius: '8px',
    },
    mobile: {
      width: '375px',
      height: '667px',
      border: '12px solid #333',
      borderRadius: '32px',
      margin: '20px auto',
    },
  };

  return (
    <div className="flex justify-center items-start p-4 bg-gray-100 min-h-full relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {error && (
        <div className="absolute top-4 left-4 right-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md z-10">
          {error}
        </div>
      )}

      <div className={viewMode === 'mobile' ? 'bg-black rounded-[44px] p-2' : ''}>
        <iframe
          ref={iframeRef}
          src={`http://localhost:3001/preview/${tenantId}`}
          style={frameStyles[viewMode]}
          title="Theme Preview"
          className="shadow-lg"
          onLoad={handleIframeLoad}
        />
      </div>
    </div>
  );
};