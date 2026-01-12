import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import http from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import cors from 'cors';

interface Theme {
  [key: string]: any;
}

interface ThemeMessage {
  type: 'theme_update' | 'error' | 'heartbeat';
  tenantId?: string;
  theme?: Theme;
  message?: string;
}

interface WebSocketWithHeartbeat extends WebSocket {
  isAlive: boolean;
  tenantId?: string;
}

export class ThemePreviewServer {
  private app: express.Application;
  private server: http.Server;
  private wss: WebSocketServer;
  private previewSessions: Map<string, Theme>;
  private clientSessions: Map<WebSocket, string>;
  private heartbeatInterval: NodeJS.Timeout | null;

  private readonly HEARTBEAT_INTERVAL = 30000;
  private readonly MAX_MESSAGE_SIZE = 5 * 1024 * 1024; // 5MB

  constructor() {
    this.app = express();

    // Enable CORS for all routes
    this.app.use(cors({
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));

    this.server = http.createServer(this.app);
    this.wss = new WebSocketServer({
      server: this.server,
      path: '/ws',
      maxPayload: this.MAX_MESSAGE_SIZE
    });
    this.previewSessions = new Map();
    this.clientSessions = new Map();
    this.heartbeatInterval = null;

    this.setupWebSocket();
    this.setupRoutes();
    this.setupHeartbeat();
  }

  private setupHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      this.wss.clients.forEach((client) => {
        const wsWithHeartbeat = client as WebSocketWithHeartbeat;
        if (!wsWithHeartbeat.isAlive) {
          this.handleClientDisconnect(wsWithHeartbeat);
          return wsWithHeartbeat.terminate();
        }

        wsWithHeartbeat.isAlive = false;
        try {
          wsWithHeartbeat.ping();
        } catch (error) {
          console.error('Error sending ping:', error);
          wsWithHeartbeat.terminate();
        }
      });
    }, this.HEARTBEAT_INTERVAL);

    this.wss.on('close', () => {
      if (this.heartbeatInterval) {
        clearInterval(this.heartbeatInterval);
      }
    });
  }

  private handleClientDisconnect(ws: WebSocketWithHeartbeat) {
    try {
      const tenantId = ws.tenantId;
      if (tenantId) {
        this.clientSessions.delete(ws);
        if (![...this.clientSessions.values()].includes(tenantId)) {
          this.previewSessions.delete(tenantId);
        }
      }
    } catch (error) {
      console.error('Error handling client disconnect:', error);
    }
  }

  private setupWebSocket() {
    this.wss.on('connection', (ws: WebSocketWithHeartbeat) => {
      ws.isAlive = true;

      ws.on('pong', () => {
        ws.isAlive = true;
      });

      ws.on('message', async (message: WebSocket.Data) => {
        try {
          if (message.toString().length > this.MAX_MESSAGE_SIZE) {
            throw new Error('Message size exceeds limit');
          }

          const data = JSON.parse(message.toString()) as ThemeMessage;
          if (data.type === 'theme_update' && data.tenantId && data.theme) {
            ws.tenantId = data.tenantId;
            this.clientSessions.set(ws, data.tenantId);
            await this.handleThemeUpdate(data.tenantId, data.theme);
          }
        } catch (error) {
          this.sendError(ws, error instanceof Error ? error.message : 'Invalid message format');
        }
      });

      ws.on('close', () => this.handleClientDisconnect(ws));

      ws.on('error', (error: Error) => {
        console.error('WebSocket error:', error);
        this.sendError(ws, 'Internal server error');
        ws.close();
      });
    });
  }

  private sendError(ws: WebSocket, message: string) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'error',
        message
      }));
    }
  }

  private setupRoutes() {
    this.app.use(express.json({ limit: '5mb' }));

    // CORS headers middleware
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PATCH, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.setHeader('Access-Control-Allow-Credentials', 'true');

      if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
      }
      next();
    });

    // Add health check endpoint
    this.app.get('/health', (_req: Request, res: Response): void => {
      res.status(200).json({ status: 'ok' });
    });

    this.setupThemeRoutes();
    this.setupPreviewRoutes();

    // Error handling middleware
    this.app.use((error: Error, _req: Request, res: Response, _next: NextFunction): void => {
      console.error('Server error:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
  }

  private setupThemeRoutes() {
    this.app.get('/themes/:tenantId', (req: Request, res: Response) => {
      const { tenantId } = req.params;
      const theme = this.previewSessions.get(tenantId);

      if (!theme) {
        res.status(404).json({ error: 'Theme not found' });
        return;
      }

      res.json(theme);
    });

    this.app.post('/themes/:tenantId', (req: Request, res: Response) => {
      const { tenantId } = req.params;
      const theme = req.body;

      if (!this.validateTheme(theme)) {
        res.status(400).json({ error: 'Invalid theme data' });
        return;
      }

      this.previewSessions.set(tenantId, theme);
      this.broadcastThemeUpdate(tenantId, theme);

      res.status(200).json({ message: 'Theme updated successfully' });
    });
  }

  private setupPreviewRoutes() {
    this.app.get('/preview/:tenantId', this.handlePreviewGet.bind(this) as RequestHandler);
    this.app.post('/preview/:tenantId', this.handlePreviewPost.bind(this) as RequestHandler);
  }

  private validateTheme(theme: any): theme is Theme {
    return theme && typeof theme === 'object';
  }

  private renderThemePreview(theme: Theme, tenantId: string): string {
    // Read the preview template and inject theme settings
    const previewHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Theme Preview - ${tenantId}</title>
          <style>
              :root {
                  --primary-color: ${theme.colors?.primary || '#4E1DAC'};
                  --secondary-color: ${theme.colors?.secondary || '#1F2937'};
                  --accent-color: ${theme.colors?.accent || '#F3F4F6'};
                  --background-color: ${theme.colors?.background || '#FFFFFF'};
                  --text-color: ${theme.colors?.text || '#1F2937'};
              }
              body {
                  margin: 0;
                  padding: 0;
                  font-family: ${theme.typography?.bodyFont || 'system-ui'}, -apple-system, sans-serif;
                  background-color: var(--background-color);
                  color: var(--text-color);
              }
              .preview-container {
                  max-width: ${theme.layout?.maxWidth || '1280px'};
                  margin: 0 auto;
                  padding: ${theme.layout?.containerPadding || '1rem'};
              }
              .preview-header {
                  padding: 1rem;
                  background-color: var(--primary-color);
                  color: white;
                  text-align: center;
              }
          </style>
      </head>
      <body>
          <div class="preview-container">
              <div class="preview-header">
                  <h1>Theme Preview</h1>
                  <p>Tenant ID: ${tenantId}</p>
              </div>
              <div id="theme-preview-content">
                  <pre id="theme-data" style="display: none;">${JSON.stringify(theme)}</pre>
              </div>
          </div>
          <script>
              window.themeData = ${JSON.stringify(theme)};

              // Listen for theme updates via WebSocket
              const ws = new WebSocket('ws://' + window.location.host + '/ws');

              ws.onopen = () => {
                  console.log('WebSocket connection established');
              };

              ws.onmessage = (event) => {
                  try {
                      const data = JSON.parse(event.data);
                      if (data.type === 'theme_update' && data.tenantId === '${tenantId}') {
                          window.themeData = data.theme;
                          document.getElementById('theme-data').textContent = JSON.stringify(data.theme);
                          applyThemeSettings(data.theme);
                      }
                  } catch (error) {
                      console.error('Error processing WebSocket message:', error);
                  }
              };

              ws.onclose = () => {
                  console.log('WebSocket connection closed');
              };

              function applyThemeSettings(theme) {
                  // Apply theme settings to the preview
                  document.documentElement.style.setProperty('--primary-color', theme.colors?.primary || '#4E1DAC');
                  document.documentElement.style.setProperty('--secondary-color', theme.colors?.secondary || '#1F2937');
                  document.documentElement.style.setProperty('--accent-color', theme.colors?.accent || '#F3F4F6');
                  document.documentElement.style.setProperty('--background-color', theme.colors?.background || '#FFFFFF');
                  document.documentElement.style.setProperty('--text-color', theme.colors?.text || '#1F2937');
              }

              // Initial application of theme settings
              applyThemeSettings(window.themeData);
          </script>
      </body>
      </html>
    `;

    return previewHtml;
  }

  private handlePreviewGet: RequestHandler = (req, res) => {
    const { tenantId } = req.params;
    const theme = this.previewSessions.get(tenantId);

    if (!theme) {
      res.status(404).send('Preview not found');
      return;
    }

    res.send(this.renderThemePreview(theme, tenantId));
  }

  private handlePreviewPost: RequestHandler = (req, res) => {
    try {
      const { tenantId } = req.params;
      const theme = req.body;

      if (!this.validateTheme(theme)) {
        res.status(400).json({ error: 'Invalid theme data' });
        return;
      }

      this.previewSessions.set(tenantId, theme);
      this.broadcastThemeUpdate(tenantId, theme);

      res.status(200).json({ message: 'Theme preview updated successfully' });
    } catch (error) {
      console.error('Error updating theme preview:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  private async handleThemeUpdate(tenantId: string, theme: Theme) {
    try {
      if (!this.validateTheme(theme)) {
        throw new Error('Invalid theme data');
      }

      const existingTheme = this.previewSessions.get(tenantId) || {};
      const updatedTheme = { ...existingTheme, ...theme };

      this.previewSessions.set(tenantId, updatedTheme);
      this.broadcastThemeUpdate(tenantId, updatedTheme);
    } catch (error) {
      console.error('Error handling theme update:', error);
      throw error;
    }
  }

  private async broadcastThemeUpdate(tenantId: string, theme: Theme) {
    try {
      const message = JSON.stringify({
        type: 'theme_update' as const,
        tenantId,
        theme
      });

      const promises = Array.from(this.wss.clients)
        .filter((client: WebSocket) =>
          client.readyState === WebSocket.OPEN &&
          this.clientSessions.get(client) === tenantId
        )
        .map((client: WebSocket) =>
          new Promise<void>((resolve, reject) => {
            client.send(message, (error) => {
              if (error) reject(error);
              else resolve();
            });
          })
        );

      await Promise.all(promises);
    } catch (error) {
      console.error('Error broadcasting theme update:', error);
    }
  }

  public start(port: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        this.server.listen(port, () => {
          console.log(`Theme preview server running on port ${port}`);
          resolve();
        });
      } catch (error) {
        console.error('Failed to start server:', error);
        reject(error);
      }
    });
  }

  public async stop(): Promise<void> {
    try {
      if (this.heartbeatInterval) {
        clearInterval(this.heartbeatInterval);
        this.heartbeatInterval = null;
      }

      await new Promise<void>((resolve, reject) => {
        this.wss.close((err) => {
          if (err) {
            console.error('Error closing WebSocket server:', err);
            reject(err);
            return;
          }
          resolve();
        });
      });

      await new Promise<void>((resolve, reject) => {
        this.server.close((err) => {
          if (err) {
            console.error('Error closing HTTP server:', err);
            reject(err);
            return;
          }
          resolve();
        });
      });

      this.previewSessions.clear();
      this.clientSessions.clear();
    } catch (error) {
      console.error('Error during server shutdown:', error);
      throw error;
    }
  }
}