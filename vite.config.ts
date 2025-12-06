import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Polyfill for process.env in browser environment if needed by some libs,
    // though usually import.meta.env is preferred in Vite.
    'process.env': process.env
  }
});