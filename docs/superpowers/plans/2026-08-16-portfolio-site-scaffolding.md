# Portfolio Site — Scaffolding & Architecture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the Vite+React+TypeScript project at the repo root with working tooling (build, lint, typecheck, test), the theme design tokens and global stylesheet, the two data sources, and the `useTheme` hook — the foundation the component build-out (a later plan) sits on.

**Architecture:** A fresh Vite + React + TS project scaffolded by hand (not via the interactive `npm create vite` prompt, since the repo root already has `old/`, `docs/`, and `design_handoff_portfolio_site/` in it — an interactive scaffold risks overwriting them). Config and source files are written directly; dependencies installed via explicit `npm install` commands. `old/` is never touched by any task in this plan.

**Tech Stack:** Vite, React 18+, TypeScript, Vitest, React Testing Library, `vitest-axe`, ESLint (flat config) + `eslint-plugin-jsx-a11y`. CSS Modules (no CSS-in-JS, no Tailwind).

**Spec:** `docs/superpowers/specs/2026-08-16-portfolio-site-design.md`

## Scope note

This plan covers only the **scaffolding and architecture** subsystem: tooling, design tokens, global stylesheet, data files, and the `useTheme` hook. It produces a project that builds, lints, typechecks, and passes tests, with a placeholder `App.tsx`. The individual UI components (`SkipLink`, `Header`, `ThemeToggle`, `About`, `SkillList`, `LinkList`, `Footer`), the final `App` composition, and the GitHub Actions deploy workflow are **separate, later plans** — each will replace/extend files this plan creates, most notably `App.tsx`.

## Global Constraints

(From the spec — apply to every task below and to all future phases.)

- Stack: Vite + React + TypeScript, deployed to GitHub Pages. Repo name is `jasonrector` → `vite.config.ts` sets `base: '/jasonrector/'`.
- CSS Modules per component (`Component.module.css`); BEM class names (`block__element--modifier`) within them. One global stylesheet only for what's genuinely global: tokens, resets, `:focus-visible`, `::selection`, the `rise` keyframes.
- No inline styles, no CSS-in-JS, no Tailwind.
- Accessibility is the top priority. `eslint-plugin-jsx-a11y` wired into lint; `vitest-axe` reports zero violations in tests once components exist.
- DRY: no repeated hand-written elements — later phases must generate the 16 skill chips and link rows from the arrays this plan creates, via `.map()`.
- Small, single-purpose components; no premature abstraction, no state library; derive from props where possible.
- `old/` is a superseded prior attempt — never modify it, never copy from it.

---

### Task 1: Project scaffold — tooling, config, smoke test

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `eslint.config.js`
- Create: `index.html`
- Create: `src/main.tsx`, `src/App.tsx`, `src/App.test.tsx`, `src/vite-env.d.ts`
- Create: `src/test/setup.ts`
- Create: `public/.nojekyll` (empty file)

**Interfaces:**
- Produces: `App` (default export, `src/App.tsx`) — a placeholder component later plans will fully rewrite. `npm run dev`, `npm run build`, `npm run typecheck`, `npm run lint`, `npm test` all work from repo root.

- [ ] **Step 1: Initialize package.json**

Run: `npm init -y`

- [ ] **Step 2: Install runtime dependencies**

Run: `npm install react react-dom`

- [ ] **Step 3: Install dev dependencies**

Run: `npm install -D vite @vitejs/plugin-react typescript @types/react @types/react-dom vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event vitest-axe eslint @eslint/js typescript-eslint eslint-plugin-jsx-a11y eslint-plugin-react-hooks eslint-plugin-react-refresh globals`

- [ ] **Step 4: Edit package.json — name, type, scripts**

Edit `package.json` so it reads:

```json
{
  "name": "jasonrector",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "typecheck": "tsc -b --noEmit",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

(Leave the `dependencies`/`devDependencies` blocks that `npm install` already wrote — only replace `name`, add `private`/`type`, and add `scripts`.)

- [ ] **Step 5: Write vite.config.ts**

Create `vite.config.ts`:

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/jasonrector/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
});
```

- [ ] **Step 6: Write TypeScript config**

Create `tsconfig.json`:

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

Create `tsconfig.app.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "Bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "types": ["@testing-library/jest-dom"]
  },
  "include": ["src"]
}
```

Create `tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "Bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 7: Write eslint.config.js**

Create `eslint.config.js`:

```js
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended, jsxA11y.flatConfigs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
);
```

- [ ] **Step 8: Write index.html**

Create `index.html`. This includes the pre-paint theme script now (README requirement — avoids a flash of the wrong theme) using the same `localStorage` → `prefers-color-scheme: light` → default-`dark` order the `useTheme` hook will use in Task 4, so the two never disagree:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Jason Rector — Front end engineer</title>
    <meta name="description" content="Jason Rector, front end engineer in Columbus, Ohio." />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Caprasimo&family=Figtree:wght@400;600;700&display=swap"
    />
    <script>
      (function () {
        try {
          var stored = localStorage.getItem('jr-site-theme');
          if (stored === 'light' || stored === 'dark') {
            document.documentElement.dataset.theme = stored;
            return;
          }
          if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            document.documentElement.dataset.theme = 'light';
            return;
          }
          document.documentElement.dataset.theme = 'dark';
        } catch (e) {
          document.documentElement.dataset.theme = 'dark';
        }
      })();
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 9: Write src/vite-env.d.ts**

```ts
/// <reference types="vite/client" />
```

- [ ] **Step 10: Write src/test/setup.ts**

```ts
import '@testing-library/jest-dom/vitest';
import 'vitest-axe/extend-expect';
```

- [ ] **Step 11: Write a placeholder src/App.tsx**

This is intentionally minimal — a later plan replaces it entirely with the real page composition (`SkipLink` + `Header` + `main` sections + `Footer`). Its only job right now is to prove the render pipeline works.

```tsx
export default function App() {
  return <h1>Jason Rector</h1>;
}
```

- [ ] **Step 12: Write src/main.tsx**

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element #root not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

- [ ] **Step 13: Write the smoke test src/App.test.tsx**

A later plan rewrites this with the full page-level assertions (skip link, landmarks, axe). For now it just proves Vitest + RTL + jsdom are wired correctly.

```tsx
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the page heading', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: 'Jason Rector' })).toBeInTheDocument();
  });
});
```

- [ ] **Step 14: Add the GitHub Pages .nojekyll placeholder**

Run: `mkdir -p public && touch public/.nojekyll`

(Vite copies everything in `public/` to the root of `dist/` on build, so this ships in the published output. The actual deploy workflow that pushes `dist/` is a later plan.)

- [ ] **Step 15: Verify everything runs**

Run, in order, and confirm each succeeds with no errors:

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

- [ ] **Step 16: Commit**

```bash
git add package.json package-lock.json vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json eslint.config.js index.html public/.nojekyll src/
git commit -m "Scaffold Vite + React + TypeScript project with tooling"
```

---

### Task 2: Design tokens + global stylesheet

**Files:**
- Create: `src/styles/tokens.css`
- Create: `src/styles/global.css`
- Modify: `src/main.tsx` (import both, before the `App` render)

**Interfaces:**
- Consumes: nothing (pure CSS).
- Produces: CSS custom properties (`--color-bg`, `--color-surface`, `--color-text`, `--color-muted`, `--color-divider`, `--color-accent`, `--font-heading`, `--font-body`) on `:root` and `[data-theme="light"]`, and a global `rise` keyframe animation every component's module CSS will reference by name in later plans.

- [ ] **Step 1: Write src/styles/tokens.css**

Values copied verbatim from the spec (dark is the default, `[data-theme="light"]` overrides):

```css
:root {
  --color-bg: #181614;
  --color-surface: #211e1a;
  --color-text: #f9f4ed;
  --color-muted: #b6ac9c;
  --color-divider: #332e28;
  --color-accent: #f6a06b;
  --font-heading: 'Caprasimo', system-ui, sans-serif;
  --font-body: 'Figtree', system-ui, sans-serif;
}

[data-theme='light'] {
  --color-bg: #f5ead8;
  --color-surface: #ebddc5;
  --color-text: #201e1d;
  --color-muted: #645c50;
  --color-divider: #dcd3c4;
  --color-accent: #8c491a;
}
```

- [ ] **Step 2: Write src/styles/global.css**

Everything the spec calls "genuinely global": resets, page-root base styles, focus ring, selection color, the shared `rise` keyframes, and the reduced-motion override.

```css
* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-body);
  font-size: 17px;
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
}

body {
  min-height: 100vh;
  padding: clamp(32px, 6vw, 84px) clamp(20px, 6vw, 72px) 72px;
}

a {
  color: var(--color-accent);
  text-underline-offset: 3px;
}

:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 3px;
}

::selection {
  background: var(--color-accent);
  color: var(--color-bg);
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
```

- [ ] **Step 3: Import both stylesheets in src/main.tsx**

Edit `src/main.tsx` — add these two imports above `import App from './App';`:

```tsx
import './styles/tokens.css';
import './styles/global.css';
```

- [ ] **Step 4: Verify the build still succeeds**

Run: `npm run build`
Expected: succeeds with no CSS or TypeScript errors.

Manual check (not automated by this plan): run `npm run dev`, open the page, and confirm the background is the dark token color (`#181614`) with light text — full visual/theme-switch verification happens once `ThemeToggle` exists in a later plan.

- [ ] **Step 5: Commit**

```bash
git add src/styles/ src/main.tsx
git commit -m "Add design tokens and global stylesheet"
```

---

### Task 3: Data files

**Files:**
- Create: `src/data/skills.ts`
- Create: `src/data/skills.test.ts`
- Create: `src/data/links.ts`
- Create: `src/data/links.test.ts`

**Interfaces:**
- Produces: `skills: readonly string[]` from `src/data/skills.ts`; `LinkEntry` interface and `links: readonly LinkEntry[]` from `src/data/links.ts`. Later plans' `SkillList`/`Chip` and `LinkList`/`LinkRow` components import these directly — no component may hand-write a skill or link entry.

- [ ] **Step 1: Write the failing tests**

Create `src/data/skills.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { skills } from './skills';

describe('skills', () => {
  it('contains 16 entries with no duplicates', () => {
    expect(skills).toHaveLength(16);
    expect(new Set(skills).size).toBe(skills.length);
  });
});
```

Create `src/data/links.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { links } from './links';

describe('links', () => {
  it('contains a GitHub entry pointing at the right profile', () => {
    const github = links.find((link) => link.label === 'GitHub');
    expect(github).toEqual({
      label: 'GitHub',
      url: 'github.com/JBRector',
      href: 'https://github.com/JBRector',
    });
  });

  it('contains a LinkedIn entry pointing at the right profile', () => {
    const linkedin = links.find((link) => link.label === 'LinkedIn');
    expect(linkedin).toEqual({
      label: 'LinkedIn',
      url: 'jason-rector',
      href: 'https://www.linkedin.com/in/jason-rector-b69953/',
    });
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/data --reporter=verbose`
Expected: FAIL — `Cannot find module './skills'` / `./links` (files don't exist yet).

- [ ] **Step 3: Write src/data/skills.ts**

Order copied verbatim from the spec:

```ts
export const skills: readonly string[] = [
  'JavaScript',
  'TypeScript',
  'HTML',
  'CSS',
  'Accessibility',
  'React',
  'Vue',
  'React Native',
  'Testing Library',
  'Jest',
  'Vite',
  'Playwright',
  'Claude Code',
  'Next.js',
  'Tailwind',
  'Sass',
];
```

- [ ] **Step 4: Write src/data/links.ts**

```ts
export interface LinkEntry {
  label: string;
  url: string;
  href: string;
}

export const links: readonly LinkEntry[] = [
  { label: 'GitHub', url: 'github.com/JBRector', href: 'https://github.com/JBRector' },
  {
    label: 'LinkedIn',
    url: 'jason-rector',
    href: 'https://www.linkedin.com/in/jason-rector-b69953/',
  },
];
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run src/data --reporter=verbose`
Expected: PASS (3 tests)

- [ ] **Step 6: Typecheck**

Run: `npm run typecheck`
Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add src/data/
git commit -m "Add skills and links data sources"
```

---

### Task 4: useTheme hook

**Files:**
- Create: `src/hooks/useTheme.ts`
- Create: `src/hooks/useTheme.test.ts`

**Interfaces:**
- Consumes: nothing beyond browser globals (`localStorage`, `matchMedia`, `document`).
- Produces: `useTheme(): { theme: 'dark' | 'light'; toggleTheme: () => void }` — the `Header`/`ThemeToggle` components in a later plan call this once (in `App`) and receive `theme`/`toggleTheme` as props down the tree. `Theme` type is also exported for reuse.

- [ ] **Step 1: Write the failing tests**

Create `src/hooks/useTheme.test.ts`:

```ts
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/hooks --reporter=verbose`
Expected: FAIL — `Cannot find module './useTheme'`.

- [ ] **Step 3: Write src/hooks/useTheme.ts**

```ts
import { useCallback, useEffect, useState } from 'react';

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'jr-site-theme';

function readStoredTheme(): Theme | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === 'dark' || stored === 'light' ? stored : null;
  } catch {
    return null;
  }
}

function prefersLight(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-color-scheme: light)').matches
    : false;
}

function getInitialTheme(): Theme {
  const stored = readStoredTheme();
  if (stored) return stored;
  return prefersLight() ? 'light' : 'dark';
}

export interface UseThemeResult {
  theme: Theme;
  toggleTheme: () => void;
}

export function useTheme(): UseThemeResult {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((previous) => {
      const next: Theme = previous === 'dark' ? 'light' : 'dark';
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // localStorage may be unavailable (private browsing, quota) — theme still updates in memory
      }
      return next;
    });
  }, []);

  return { theme, toggleTheme };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/hooks --reporter=verbose`
Expected: PASS (6 tests)

- [ ] **Step 5: Typecheck and lint**

Run: `npm run typecheck && npm run lint`
Expected: no errors.

- [ ] **Step 6: Run the full test suite**

Run: `npm test`
Expected: all tests pass (App smoke test, skills, links, useTheme).

- [ ] **Step 7: Commit**

```bash
git add src/hooks/
git commit -m "Add useTheme hook with localStorage and prefers-color-scheme fallback"
```

---

## After this plan

With this merged, the next phase (a separate plan) builds the UI components (`SkipLink`, `Header`, `ThemeToggle`, `About`, `SkillList`/`Chip`, `LinkList`/`LinkRow`, `Footer`) on top of these tokens/data/hook, then composes them into the real `App.tsx` — replacing today's placeholder. A final plan adds the GitHub Actions deploy workflow.
