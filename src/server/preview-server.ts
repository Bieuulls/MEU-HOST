import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import { ThemePreviewServer } from './ThemePreviewServer.js';

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Create WebSocket server
const wsServer = new WebSocketServer({
  server,
  path: '/ws'
});

const themePreviewServer = new ThemePreviewServer(wsServer);

// Start the server on port 3001
themePreviewServer.start(3001).catch(error => {
  console.error('Failed to start theme preview server:', error);
  process.exit(1);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received. Shutting down gracefully...');
  themePreviewServer.stop().then(() => {
    process.exit(0);
  }).catch(error => {
    console.error('Error during shutdown:', error);
    process.exit(1);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received. Shutting down gracefully...');
  themePreviewServer.stop().then(() => {
    process.exit(0);
  }).catch(error => {
    console.error('Error during shutdown:', error);
    process.exit(1);
  });
});