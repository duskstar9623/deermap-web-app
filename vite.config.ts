import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // Enable React support and parse JSX syntax
    react(),
    // Import SVG files as React components
    svgr({
      svgrOptions: {
        icon: true,
        svgoConfig: {
          plugins: [{ name: 'removeViewBox', active: false }],
        },
      }
    })
  ],
  resolve: {
    // Path alias
    alias: {
      "@": path.resolve(__dirname, "./src"),
    }
  },
  build: {
    rollupOptions: {
      output: {
        // Manual chunk splitting strategy
        manualChunks: {
          // Core runtime, rarely changes, can be cached long-term by the browser
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Loaded only when multilingual support is needed, reducing initial bundle size
          i18n: ['i18next', 'react-i18next'],
          // Charting and animation libraries, loaded on demand for better performance
          recharts: ['recharts'],
          'framer-motion': ['framer-motion'],
        },
      },
    },
  },
});
