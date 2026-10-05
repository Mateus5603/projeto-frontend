import { defineConfig } from 'vite';
import { ViteMinifyPlugin } from 'vite-plugin-minify';

export default defineConfig({
  base: './',
  plugins: [ViteMinifyPlugin()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: 'html/index.html',
        componentes: 'html/componentes.html'
      }
    }
  }
});