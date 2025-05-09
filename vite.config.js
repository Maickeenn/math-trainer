import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['tests/**/*.test.js']
  }
});
