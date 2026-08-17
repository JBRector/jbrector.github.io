import { describe, expect, it } from 'vitest';
// Imported as a raw string (Vite's `?raw` loader) rather than read from disk via
// `node:fs` + `new URL('../index.html', import.meta.url)`: vitest's jsdom environment
// overrides the global URL constructor, which silently resolves relative bases against
// the jsdom document location instead of import.meta.url, and `node:fs`/`node:path` typings
// aren't available in this project (no @types/node). The `?raw` import sidesteps both.
import html from '../index.html?raw';
import { STORAGE_KEY } from './hooks/useTheme';

describe('index.html pre-paint theme script', () => {
  it('uses the same localStorage key as useTheme', () => {
    expect(html).toContain(`'${STORAGE_KEY}'`);
  });

  it('checks the same prefers-color-scheme query as useTheme', () => {
    expect(html).toContain('(prefers-color-scheme: light)');
  });

  it('defaults to dark, matching useTheme', () => {
    expect(html).toMatch(/document\.documentElement\.dataset\.theme = 'dark'/);
  });
});
