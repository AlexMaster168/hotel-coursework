import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
export default defineConfig({
  plugins: [react(), svgr()],
  server: { port: 5173, strictPort: true, proxy: { '/api': 'http://127.0.0.1:8080', '/images': 'http://127.0.0.1:8080' } },
  build: { outDir: 'dist', sourcemap: false },
});
