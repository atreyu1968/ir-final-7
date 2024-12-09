import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    server: {
      port: 3000,
      host: true,
      strictPort: true,
      watch: {
        usePolling: true,
        interval: 100
      }
    },
    define: {
      'process.env': {},
      'import.meta.env.VITE_ADMIN_EMAIL': JSON.stringify(env.VITE_ADMIN_EMAIL || 'admin@redinnovacionfp.es'),
      'import.meta.env.VITE_ADMIN_PASSWORD': JSON.stringify(env.VITE_ADMIN_PASSWORD || 'Admin2024Secure!'),
    },
    optimizeDeps: {
      exclude: ['lucide-react']
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'ui-vendor': ['@headlessui/react', '@tremor/react', 'lucide-react'],
            'editor-vendor': ['@tiptap/core', '@tiptap/react', '@tiptap/starter-kit']
          }
        }
      }
    }
  };
});