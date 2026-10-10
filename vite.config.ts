import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { moduleCatalog } from './src/modules/catalog.ts';

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    target: 'es2020',
    // Preserve traditional media-query syntax for older iOS/WebKit clients.
    cssTarget: 'safari14',
    modulePreload: { polyfill: false },
    rollupOptions: { input: Object.fromEntries(moduleCatalog.map(module => [module.id, module.entry])) },
  },
  test: { environment: 'jsdom', include: ['src/**/*.test.{ts,tsx}'], clearMocks: true },
});
