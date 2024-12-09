import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '192.168.1.37',
    port: 3000,
    strictPort: true,
    watch: {
      usePolling: true,
      interval: 100
    }
  },
  preview: {
    host: '192.168.1.37',
    port: 3000,
    strictPort: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@headlessui/react', '@tremor/react', 'lucide-react'],
          'editor-vendor': ['@tiptap/core', '@tiptap/react', '@tiptap/starter-kit'],
          'chart-vendor': ['recharts']
        }
      }
    }
  },
  define: {
    'process.env': process.env
  }
});