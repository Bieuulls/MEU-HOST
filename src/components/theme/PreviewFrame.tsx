import React, { useEffect, useRef, useState } from 'react';

interface PreviewFrameProps {
  src: string;
  viewMode: 'desktop' | 'mobile';
  onLoad?: () => void;
}

export const PreviewFrame: React.FC<PreviewFrameProps> = ({ src, viewMode, onLoad }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const frameStyles = {
    desktop: {
      width: '100%',
      height: '100%',
      border: 'none',
      borderRadius: '8px',
    },
    mobile: {
      width: '375px',
      height: '667px',
      border: '12px solid #333',
      borderRadius: '32px',
    },
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      <iframe
        ref={iframeRef}
        src={src}
        style={frameStyles[viewMode]}
        title="Preview Frame"
        className="shadow-lg"
        onLoad={handleLoad}
        sandbox="allow-same-origin allow-scripts"
      />
    </div>
  );
};