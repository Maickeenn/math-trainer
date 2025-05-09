import { defineConfig } from 'vite';

export default defineConfig({
  base: '/math-trainer/',
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['tests/**/*.test.js']
  }
});
