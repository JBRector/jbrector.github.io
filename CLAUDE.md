# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page personal portfolio site for Jason Rector (front end engineer, Columbus, Ohio) — Vite + React + TypeScript, deployed to GitHub Pages. No routing, no backend, no forms, no analytics. One interactive feature: a dark/light theme toggle.

## Commands

```bash
npm run dev         # Vite dev server
npm run build        # tsc -b && vite build
npm run preview      # preview the production build
npm run typecheck    # tsc -b --noEmit
npm run lint         # eslint .
npm test             # vitest run (full suite, single run)
npm run test:watch   # vitest (watch mode)
```

Run a single test file: `npx vitest run src/components/Header/Header.test.tsx --reporter=verbose` (add `-t "<name>"` to filter to one test within a file).

`.npmrc` sets `legacy-peer-deps=true` — required because `eslint-plugin-jsx-a11y`'s declared peer range doesn't yet cover the installed `eslint` 10.

## Architecture

**Composition root:** `src/App.tsx` calls `useTheme()` exactly once and threads `{ theme, toggleTheme }` down through `Header` into `ThemeToggle` — no other component touches theme state. Render order is `SkipLink` → `Header` → `<main id="main" tabIndex={-1}>` (`About`, `SkillList`, `LinkList`) → `Footer`. Section order is load-bearing: each section's CSS Module hard-codes its own `rise` animation stagger delay (`0s`, `.06s`, `.12s`, `.18s`, `.24s`) rather than deriving it from position, so reordering sections desyncs the entrance animation with nothing to catch it.

**Theme system, duplicated on purpose:** `src/hooks/useTheme.ts` resolves the theme from `localStorage['jr-site-theme']` → `prefers-color-scheme` → default `'dark'`, and writes back on toggle. `index.html` has an inline pre-paint `<script>` that re-implements the *same* resolution logic so the theme is set before React mounts (avoids a flash of the wrong theme). These two must stay in sync — `src/index-html-theme-sync.test.ts` asserts the inline script references the same storage key, the same media query, and the same default as the hook. If you change any of those in `useTheme.ts`, update `index.html`'s script to match or this test will fail.

**Styling:** CSS Modules per component (`Component.module.css`), BEM class names inside them (`block__element--modifier`), accessed via bracket notation where the key contains `__` (e.g. `styles['header__heading']`). No inline styles, no CSS-in-JS, no Tailwind. Exactly one global stylesheet pair: `src/styles/tokens.css` (`:root` / `[data-theme='light']` custom properties — colors, fonts, `color-scheme`) and `src/styles/global.css` (resets, `:focus-visible`, `::selection`, the shared `rise` keyframe, `prefers-reduced-motion` override). Components reference tokens/keyframes by name and never redefine them.

**Data-driven lists:** `src/data/skills.ts` (16 strings) and `src/data/links.ts` (`LinkEntry[]`) are the only sources for the skill chips and link rows — `SkillList`/`LinkList` render them via a single `.map()` each, never hand-written repeated elements.

**Folder-internal subcomponents:** `SkillList/Chip.tsx`, `LinkList/LinkRow.tsx`, and `ThemeToggle/{SunIcon,MoonIcon}.tsx` share their parent's CSS Module and are imported only within their own folder — nothing outside should import them directly.

**Accessibility is a binding constraint, not polish:** `eslint-plugin-jsx-a11y` is wired into `eslint.config.js`; `vitest-axe` runs in every component's tests via `src/test/setup.ts`. That setup file hand-registers the axe matcher directly from `vitest-axe/dist/matchers` instead of the package's documented entry points — the published `vitest-axe@0.1.0` ships a broken/type-only export that silently no-ops otherwise (see the comment block at the top of `setup.ts` before touching this or upgrading the package).

**Reference docs:**
- `docs/superpowers/specs/2026-08-16-portfolio-site-design.md` — the binding design spec (exact tokens, spacing, typography, accessibility requirements, component-by-component behavior).
- `docs/superpowers/plans/` — the two implementation plans (scaffolding, component build-out) this codebase was built from.

**Deployment:** `.github/workflows/deploy.yml` builds and publishes `dist/` to GitHub Pages on every push to `main` (via `actions/upload-pages-artifact` + `actions/deploy-pages`). The repo is the account's user-page repo (`JBRector/jbrector.github.io`), served from the domain root, so `vite.config.ts` sets `base: '/'`.
