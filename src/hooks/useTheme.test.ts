import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useTheme } from './useTheme';

function mockMatchMedia(prefersLight: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-color-scheme: light)' ? prefersLight : false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
}

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('defaults to dark when nothing is stored and there is no light preference', () => {
    mockMatchMedia(false);

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('uses prefers-color-scheme: light when nothing is stored', () => {
    mockMatchMedia(true);

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('light');
  });

  it('restores a stored theme over the media query preference', () => {
    localStorage.setItem('jr-site-theme', 'light');
    mockMatchMedia(false);

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('light');
  });

  it('toggleTheme flips the theme, updates the root attribute, and persists it', () => {
    mockMatchMedia(false);
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('light');
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(localStorage.getItem('jr-site-theme')).toBe('light');
  });

  it('falls back to the default when localStorage.getItem throws', () => {
    mockMatchMedia(false);
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('dark');
  });

  it('does not crash when localStorage.setItem throws during toggle', () => {
    mockMatchMedia(false);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded');
    });

    const { result } = renderHook(() => useTheme());

    expect(() => {
      act(() => {
        result.current.toggleTheme();
      });
    }).not.toThrow();
    expect(result.current.theme).toBe('light');
  });
});
