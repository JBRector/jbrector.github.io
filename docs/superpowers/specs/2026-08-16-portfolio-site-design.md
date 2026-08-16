# Design: Jason Rector personal site (single page)

Source handoff: `design_handoff_portfolio_site/README.md` and `design_handoff_portfolio_site/design-reference/`.

## Overview

A one-page personal site: name/title header, first-person bio, skills list, two outbound links (GitHub, LinkedIn), and a dark/light theme toggle. No routing, no backend, no forms, no analytics.

This is a **fresh build at the repo root** (`jasonrector/`). `old/` contains a larger, superseded prior attempt (`jasonrector.github.io`, multi-section with Hero/OpenSource/Contact/scroll-spy) and is left untouched — not reused, not migrated from.

## Stack

- Vite + React + TypeScript (`npm create vite@latest -- --template react-ts`), deployed to GitHub Pages.
- Repo root = this directory, repo name = `jasonrector` → GitHub Pages project-page URL, so `vite.config.ts` sets `base: '/jasonrector/'`.
- GitHub Actions workflow builds on push to `main` and deploys `dist/` via `actions/upload-pages-artifact` + `actions/deploy-pages`. `.nojekyll` ships in the published output.
- Vitest + React Testing Library + `vitest-axe` for tests.
- `eslint-plugin-jsx-a11y` in the lint config.

## File structure

```
jasonrector/
├── .github/workflows/deploy.yml
├── public/.nojekyll
├── index.html
├── vite.config.ts                      # base: '/jasonrector/'
├── tsconfig.json
├── package.json
├── eslint.config.js                    # + eslint-plugin-jsx-a11y
└── src/
    ├── main.tsx
    ├── App.tsx                         # page composition only
    ├── App.test.tsx                    # skip-link-first-focusable, landmark/heading nav, vitest-axe both themes
    ├── styles/
    │   ├── tokens.css                  # :root + [data-theme="light"] custom properties
    │   └── global.css                  # reset, :focus-visible, ::selection, @keyframes rise, reduced-motion
    ├── data/
    │   ├── skills.ts                   # string[], 16 entries
    │   └── links.ts                    # { label, url, href }[]
    ├── hooks/
    │   ├── useTheme.ts                 # 'dark' | 'light', localStorage-backed, prefers-color-scheme fallback
    │   └── useTheme.test.ts
    └── components/
        ├── SkipLink/{SkipLink.tsx,.module.css,.test.tsx}
        ├── Header/{Header.tsx,.module.css,.test.tsx}
        ├── ThemeToggle/
        │   ├── ThemeToggle.tsx
        │   ├── SunIcon.tsx
        │   ├── MoonIcon.tsx
        │   ├── ThemeToggle.module.css
        │   └── ThemeToggle.test.tsx
        ├── About/{About.tsx,.module.css,.test.tsx}
        ├── SkillList/
        │   ├── SkillList.tsx
        │   ├── Chip.tsx
        │   ├── SkillList.module.css
        │   └── SkillList.test.tsx
        ├── LinkList/
        │   ├── LinkList.tsx
        │   ├── LinkRow.tsx
        │   ├── LinkList.module.css
        │   └── LinkList.test.tsx
        └── Footer/{Footer.tsx,.module.css,.test.tsx}
```

`Chip` and `LinkRow` are nested inside their parent's folder (not top-level components) — each is only ever rendered by its parent list and shares that parent's CSS module.

## Components

| Component | Responsibility | Props | Notes |
| --- | --- | --- | --- |
| `SkipLink` | `<a href="#main">Skip to content</a>`, off-screen until focus | none | pill styling, moves on-screen on `:focus` |
| `Header` | name/title block + `ThemeToggle` | `theme`, `onToggleTheme` | flex row, `<h1>` + subtitle in a column |
| `ThemeToggle` | 48px circular button, swaps sun/moon icon and `aria-label` | `theme`, `onToggle` | icon shows the *action*, not the current state (sun while dark, moon while light) |
| `SunIcon` / `MoonIcon` | inline SVG, `stroke-width:2.75`, `aria-hidden` | none | copied from `design-reference/index.html`, no icon-library dependency |
| `About` | visually-hidden `<h2>About</h2>`, 3 bio paragraphs | none | static copy from README |
| `SkillList` | eyebrow `<h2>`, `<ul>` of `Chip` from `data/skills.ts` | none | one `.map()`, never hand-written chips |
| `Chip` | single `<li>` pill, non-interactive | `label: string` | |
| `LinkList` | eyebrow `<h2>`, `<ul>` of `LinkRow` from `data/links.ts` | none | one `.map()`, never hand-written rows |
| `LinkRow` | full-width `<a>` with label/url/arrow spans, `rel="me"` | `label, url, href` | arrow is `aria-hidden`; hover/focus shifts padding + accent color |
| `Footer` | single line of footer copy | none | **placeholder copy for now** (see Open items) |

## Data flow

`useTheme()` is called once in `App`. It owns `{ theme, toggleTheme }`:
- Init: read `localStorage['jr-site-theme']`; if unset, fall back to `window.matchMedia('(prefers-color-scheme: dark)')` — if that's also unavailable/inconclusive, default `'dark'`.
- On toggle: flip `theme`, write to `localStorage`, set `document.documentElement.dataset.theme`.
- `App` passes `theme`/`toggleTheme` down through `Header` into `ThemeToggle`.
- A pre-paint inline script in `index.html` sets `data-theme` before React mounts (avoids flash of wrong theme), same as the reference file — now also needs to check `prefers-color-scheme` when no stored value exists, to stay consistent with the hook's logic.

`skills.ts` and `links.ts` are the only data sources for their respective lists — no component hand-writes an entry.

## Styling

- CSS Modules per component (`Component.module.css`), BEM class names within each (`chip`, `chip--muted`, `links__row`, etc.).
- One global stylesheet split into `tokens.css` (custom properties only) and `global.css` (resets, focus-visible, selection, keyframes, reduced-motion).
- No inline styles, no CSS-in-JS, no Tailwind.
- Design tokens (final values, both themes) as specified in the README — copied verbatim, not re-derived from `organic-styles.css` (that file is the source system only; this page ships its own dark-first inversion).

## Testing

- Vitest + React Testing Library + `vitest-axe`, one test file per component testing behavior, not markup (per the README's explicit list: `ThemeToggle` icon/label/localStorage/persistence/throw-safety, `SkillList` item count and list semantics, `LinkRow`/`LinkList` accessible name and hidden arrow, `Header` single `<h1>`, `App`/page skip-link-first and heading-reachable-sections, `vitest-axe` zero violations in both themes).
- `eslint-plugin-jsx-a11y` wired into lint.

## Decisions resolved during review

1. Repo root = this directory; repo name = `jasonrector` → `base: '/jasonrector/'`.
2. `accent`/`showSkills` props present in `Portfolio.dc.html` are authoring-tool artifacts, not requirements — dropped entirely.
3. Icons are hand-copied inline SVG, not a `lucide-react` dependency.
4. Footer copy is **placeholder** — swap out before shipping (see Open items).
5. Test runner: Vitest + RTL + `vitest-axe` (not Jest/jest-axe).
6. `rel="me"` added to both link rows.
7. Theme init: `localStorage` → `prefers-color-scheme` → default `'dark'`.
8. No OG image for v1.
9. `old/` is left untouched; new build scaffolds fresh at the repo root.

## Open items

- **Footer copy is a placeholder.** Using a dad joke until Jason supplies real copy: *"Why do programmers prefer dark mode? Because light attracts bugs."* Must be swapped before the site ships.
- Font loading strategy (Google Fonts CDN link vs. self-hosted WOFF2) — not decided; default to the CDN `<link>` as in the reference file unless told otherwise.
- CI workflow assumes `npm` and a current Node LTS; not yet confirmed.
