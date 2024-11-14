import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import * as packageJson from './package.json';

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
  ],
  define: {
    'process.env': {},
    global: {},
  },
  server: {
    open: '/demo/index.html'
  },
  build: {
    lib: {
      entry: './src/index.ts',
      formats: ['es', 'umd'],
      fileName: (format) => `mirador-annotations${format}.js`
    },
    rollupOptions: {
      output: {
        preserveModules: true,
        assetFileNames: 'mirador-annotations.[ext]',
          inlineDynamicImports: true
      }
    },
    sourcemap: true
  }
});