import React, { useEffect, useRef } from 'react';

interface PreviewProps {
  viewMode: 'desktop' | 'mobile';
  url: string;
}

export const Preview: React.FC<PreviewProps> = ({ viewMode, url }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.src = url;
    }
  }, [url]);

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
    <div className="flex justify-center items-start p-4 bg-gray-100 min-h-full">
      <div className={viewMode === 'mobile' ? 'bg-black rounded-[44px] p-2' : ''}>
        <iframe
          ref={iframeRef}
          src={url}
          style={frameStyles[viewMode]}
          title="Theme Preview"
          className="shadow-lg"
        />
      </div>
    </div>
  );
};