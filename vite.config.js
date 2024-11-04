import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import * as packageJson from './package.json';

export default defineConfig({
  plugins: [
    // react({
    //     jsxRuntime: 'classic' 
    // }),
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
      formats: ['es'],
      fileName: (format) => `mirador-annotations${format}.js`
    },
    rollupOptions: {
    //   external: [
    //     ...Object.keys(packageJson.peerDependencies),
    //     '@annotorious/core',
    //     '@annotorious/annotorious',
    //     '@annotorious/openseadragon'
    //   ],
      output: {
        preserveModules: true,
        assetFileNames: 'mirador-annotations.[ext]',
          inlineDynamicImports: true
      }
    },
    sourcemap: true
  }
});