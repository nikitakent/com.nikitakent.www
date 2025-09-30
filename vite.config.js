// vite.config.js
import { resolve } from 'path';

export default {
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        abt: resolve(__dirname, 'abt.html'),
      },
    },
  },
};
