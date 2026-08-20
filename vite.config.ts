import { configDefaults, defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/jasonrector/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    // `old/` is a superseded prior attempt with its own separate project
    // (package.json, test setup) — never run its tests under this config.
    exclude: [...configDefaults.exclude, 'old/**'],
  },
});
