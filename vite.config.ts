import { defineConfig } from 'vitest/config';

export default defineConfig({
  base: '/2026-GOSEONG/',
  build: {
    target: 'es2022',
    sourcemap: true,
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
});
