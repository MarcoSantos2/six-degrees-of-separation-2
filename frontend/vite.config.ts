import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    },
    host: true,
    port: 5173,
    strictPort: true,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'social-ducks-jam.loca.lt',
      'young-bars-rhyme.loca.lt',
      'six-degrees-game.loca.lt',
      'easy-parrots-learn.loca.lt'
    ]
  },
}); 