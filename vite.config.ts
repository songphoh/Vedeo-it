import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      // Define 'process.env' variables to be replaced during build
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      // Use the provided Client ID as default if not found in env
      'process.env.GOOGLE_CLIENT_ID': JSON.stringify(env.GOOGLE_CLIENT_ID || "441626360118-fpn3bpdrpc1n4c5ucqussq5me8djesoh.apps.googleusercontent.com"),
    }
  };
});