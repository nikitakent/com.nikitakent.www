// vite.config.js
import { resolve } from 'path';

export default {
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        abt: resolve(__dirname, 'abt.html'),
        writing: resolve(__dirname, 'writing.html'),
        marketDesign: resolve(__dirname, 'market-design.html'),
        books: resolve(__dirname, 'books.html'),
      },
    },
  },
};
