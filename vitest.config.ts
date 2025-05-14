/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/unit/setup.ts'],
    exclude: ['**/node_modules/**', '**/tests/e2e/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', '.astro/', 'tests/'],
    },
  },
  resolve: {
    alias: {
      '~': new URL('./src', import.meta.url).pathname,
      '@': path.resolve(__dirname, './src')
    },
  },
  plugins: [
    {
      name: 'vitest-plugin-json',
      transform(code, id) {
        if (id.endsWith('.json')) {
          return {
            code: `export default ${code}`,
            map: null
          };
        }
      }
    }
  ]
}); 