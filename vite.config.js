import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base path for GitHub Pages - update 'universe-viewer' to match your repo name
  base: '/universe-viewer/',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split three.js into its own chunk (largest dependency)
          if (id.includes('node_modules/three')) {
            return 'three';
          }
          // Split React Three ecosystem
          if (id.includes('node_modules/@react-three')) {
            return 'react-three';
          }
          // Split React core
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) {
            return 'vendor';
          }
        }
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://exoplanetarchive.ipac.caltech.edu',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
