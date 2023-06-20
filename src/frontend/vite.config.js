import  { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import EnvironmentPlugin from 'vite-plugin-environment'



export default defineConfig({
  plugins: [
    react(),
    // Spreads all the envars from .env prefixed with "CANISTER_" onto import.meta.env. 
    EnvironmentPlugin("all", { prefix: "CANISTER_", defineOn: "import.meta.env" }),
    // Spreads all the envars from .env prefixed with "DFX_" onto import.meta.env. 
    EnvironmentPlugin("all", { prefix: "DFX_", defineOn: "import.meta.env" }),
  ],
  build: {
    outDir: "dist/",
    emptyOutDir: true,
  },
  worker: {
    format: 'es'
  },
  define: {
    // This project doesn't reference process.env _anywhere_, but canister type declarations 
    // do use process.env by default, so if you import actors from dfx generate's output, 
    // you'd have to add them here like:
    // 'process.env.DFX_NETWORK': JSON.stringify(process.env.DFX_NETWORK),
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


// https://www.npmjs.com/package/unplugin-icons
