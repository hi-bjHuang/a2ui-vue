import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import {resolve} from 'path';

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        'v0_9/index': resolve(__dirname, 'src/v0_9/index.ts'),
      },
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['vue', 'zod', '@a2ui/web_core', '@a2ui/web_core/v0_9', '@a2ui/web_core/v0_9/basic_catalog', '@a2ui/markdown-it'],
      output: {
        globals: {vue: 'Vue'},
      },
    },
  },
});
