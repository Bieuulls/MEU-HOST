import { ThemePreviewServer } from './ThemePreviewServer.js';

const themePreviewServer = new ThemePreviewServer();

// Start the server on port 3002
themePreviewServer.start(3002).catch(error => {
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
