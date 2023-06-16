import  { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import EnvironmentPlugin from 'vite-plugin-environment'

export default defineConfig({
  plugins: [
    react(),
    // Maps all envars prefixed with 'CANISTER_' to process.env.*
    EnvironmentPlugin("all", { prefix: "CANISTER_" }),
    // Weirdly process not available to Webworker but import.meta.env will be.
    EnvironmentPlugin("all", { prefix: "CANISTER_", defineOn: 'import.meta.env' }),
    // Maps all envars prefixed with 'DFX_' to process.env.*
    EnvironmentPlugin("all", { prefix: "DFX_" }),
    // Weirdly process not available to Webworker but import.meta.env will be.
    EnvironmentPlugin("all", { prefix: "DFX_", defineOn: 'import.meta.env' }),
  ],
  build: {
    outDir: "dist/",
    emptyOutDir: true,
  },
  optimizeDeps: {
    esbuildOptions: {
        // Node.js global to browser globalThis.
        // (Makes it possible for WebWorker to use imports.) 
        define: {
            global: 'globalThis'
        },
    }
  },
  server: {
    // Local IC replica proxy.  
    proxy: {
      '/api': {
        // Default port used. 
        target: 'http://127.0.0.1:4943',
        changeOrigin: true
      }
    }
  }
})