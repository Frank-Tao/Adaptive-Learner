import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    globals: true
  },
  server: {
    port: 5173
  },
  build: {
    rollupOptions: {
      input: {
        consumer: resolve(__dirname, 'index.html'),
        business: resolve(__dirname, 'business.html')
      }
    }
  }
});
