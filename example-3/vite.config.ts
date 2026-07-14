import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

const libRoot = path.resolve(__dirname, '..');
const libSrc = path.resolve(libRoot, 'src');

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@nextleap-al/admin-ui/styles.css': path.resolve(libSrc, 'styles/index.css'),
      '@nextleap-al/admin-ui/tokens.css': path.resolve(libSrc, 'styles/tokens.css'),
      '@nextleap-al/admin-ui': path.resolve(libSrc, 'index.ts'),
      '@': libSrc,
    },
    // Dedupe every package the example and the library both pull in, so there is a single
    // copy of each — the example always runs against the library's own dependency versions.
    dedupe: [
      'react',
      'react-dom',
      'react-router-dom',
      'react-hook-form',
      'lucide-react',
      '@tanstack/react-table',
    ],
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
