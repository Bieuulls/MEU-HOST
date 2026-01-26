import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Start backend server
const backendServer = spawn('node', ['server.js'], {
  stdio: 'inherit',
  cwd: __dirname
});

// Start Vite dev server
const viteServer = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  cwd: __dirname,
  shell: true
});

// Handle process termination
const cleanup = () => {
  backendServer.kill();
  viteServer.kill();
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

// Handle child process errors
backendServer.on('error', (err) => {
  console.error('Backend server error:', err);
  cleanup();
});

viteServer.on('error', (err) => {
  console.error('Vite server error:', err);
  cleanup();
});

// Log process exit
backendServer.on('exit', (code) => {
  console.log(`Backend server exited with code ${code}`);
  cleanup();
});

viteServer.on('exit', (code) => {
  console.log(`Vite server exited with code ${code}`);
  cleanup();
});