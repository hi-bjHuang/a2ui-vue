import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import {fileURLToPath, URL} from 'node:url';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@hi-bjhuang/a2ui-vue': fileURLToPath(new URL('../src/index.ts', import.meta.url)),
    },
    dedupe: ['vue'],
  },
  server: {
    port: 5180,
  },
});
