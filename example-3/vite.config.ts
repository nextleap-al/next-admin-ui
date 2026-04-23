import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

const libRoot = path.resolve(__dirname, '..');
const libSrc = path.resolve(libRoot, 'src');

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@nextleap-al/admin-ui/tailwind-preset': path.resolve(libSrc, 'tailwind-preset.ts'),
      '@nextleap-al/admin-ui/styles.css': path.resolve(libSrc, 'styles/index.css'),
      '@nextleap-al/admin-ui/tokens.css': path.resolve(libSrc, 'styles/tokens.css'),
      '@nextleap-al/admin-ui': path.resolve(libSrc, 'index.ts'),
      '@': libSrc,
    },
    dedupe: ['react', 'react-dom', 'react-router-dom'],
  },
  server: {
    port: 5175,
    host: true,
    fs: {
      allow: [libRoot],
    },
  },
  optimizeDeps: {
    exclude: ['@nextleap-al/admin-ui'],
  },
});
