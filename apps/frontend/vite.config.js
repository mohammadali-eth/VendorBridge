import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pathRewritePlugin = () => ({
  name: 'path-rewrite-plugin',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url && req.url.includes('/@fs/home/mohammad-ali/VendorBridge/')) {
        req.url = req.url.replace('/@fs/home/mohammad-ali/VendorBridge/', '/@fs/home/mohammad-ali/%0AVendorBridge%0A/');
      }
      next();
    });
  }
});

export default defineConfig({
  plugins: [react(), pathRewritePlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    preserveSymlinks: true,
  },
  server: {
    port: 5173,
    fs: {
      allow: [
        path.resolve(__dirname, '../..'),
        '/home/mohammad-ali',
        '/home/mohammad-ali/VendorBridge',
        '/home/mohammad-ali/\nVendorBridge\n'
      ]
    },
    proxy: {
      '/api/v1': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
