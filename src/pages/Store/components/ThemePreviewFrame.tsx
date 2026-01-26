import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';

interface ThemePreviewFrameProps {
  previewUrl: string;
  viewMode: 'desktop' | 'mobile';
}

interface ThemeUpdateMessage {
  type: 'theme_update';
  theme: Record<string, unknown>;
}

interface ConnectionState {
  status: 'connecting' | 'connected' | 'disconnected' | 'error';
  error?: string;
}

const ThemePreviewFrame: React.FC<ThemePreviewFrameProps> = ({ previewUrl, viewMode }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { theme } = useTheme();
  const [connectionState, setConnectionState] = useState<ConnectionState>({ status: 'connecting' });
  const wsRef = useRef<WebSocket>();

  useEffect(() => {
    let reconnectTimeout: NodeJS.Timeout;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;
    const reconnectDelay = 3000;

    const connect = () => {
      try {
        wsRef.current = new WebSocket('ws://localhost:3001/ws');

        wsRef.current.onopen = () => {
          console.log('WebSocket connected');
          setConnectionState({ status: 'connected' });
          reconnectAttempts = 0;

          if (theme) {
            wsRef.current?.send(JSON.stringify({
              type: 'theme_update',
              tenantId: '1',
              theme
            }));
          }
        };

        wsRef.current.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data) as ThemeUpdateMessage;
            if (data.type === 'theme_update' && iframeRef.current?.contentWindow) {
              iframeRef.current.contentWindow.postMessage(
                { type: 'theme_update', settings: data.theme },
                '*'
              );
            }
          } catch (error) {
            console.error('Error processing WebSocket message:', error);
            setConnectionState({
              status: 'error',
              error: 'Failed to process server message'
            });
          }
        };

        wsRef.current.onerror = (error) => {
          console.error('WebSocket error:', error);
          setConnectionState({
            status: 'error',
            error: 'Connection error occurred'
          });
        };

        wsRef.current.onclose = () => {
          console.log('WebSocket disconnected');
          setConnectionState({ status: 'disconnected' });

          if (reconnectAttempts < maxReconnectAttempts) {
            reconnectAttempts++;
            reconnectTimeout = setTimeout(connect, reconnectDelay);
          } else {
            setConnectionState({
              status: 'error',
              error: 'Max reconnection attempts reached'
            });
          }
        };
      } catch (error) {
        console.error('Error creating WebSocket connection:', error);
        setConnectionState({
          status: 'error',
          error: 'Failed to establish connection'
        });
      }
    };

    connect();

    return () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
  }, [theme]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'theme_update' && iframeRef.current) {
        iframeRef.current.src = previewUrl;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [previewUrl]);

  const frameStyles = {
    desktop: {
      width: '100%',
      height: 'calc(100vh - 120px)',
      border: 'none',
    },
    mobile: {
      width: '375px',
      height: '667px',
      border: '12px solid #333',
      borderRadius: '32px',
      margin: '20px auto',
    },
  } as const;

  if (connectionState.status === 'error') {
    return (
      <div className="flex items-center justify-center h-full bg-red-50 p-4 text-red-600">
        <p>{connectionState.error || 'An error occurred'}</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {connectionState.status === 'connecting' && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
          <p className="text-gray-600">Connecting to preview server...</p>
        </div>
      )}
      <iframe
        ref={iframeRef}
        src={previewUrl}
        style={frameStyles[viewMode]}
        title="Theme Preview"
        sandbox="allow-same-origin allow-scripts"
      />
    </div>
  );
};

export default ThemePreviewFrame;