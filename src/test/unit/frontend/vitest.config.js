import { defineConfig } from "vitest/config";
import * as url from 'url';
import viteConfig from '../../../frontend/vite.config';
import path from 'path';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  ...viteConfig,
  resolve: {
    alias: {
      '@': path.join(__dirname, '..', '..', '..', 'frontend', 'src'),
    }
  },
  test: {
    globals:true,
    setupFiles: ['./setup-teardown-hooks.js'],
    environment: 'jsdom',
    include: ['**/src/*.test.js'],
  }
})


