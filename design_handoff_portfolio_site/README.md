# Handoff: Jason Rector — personal site (single page)

## Overview
A one-page personal site for Jason Rector, a front end engineer in Columbus, Ohio. It holds a name/title header, a short first-person bio, a skills list, and two outbound links (GitHub, LinkedIn). A single interactive control toggles dark/light theme and persists the choice. No routing, no backend, no forms, no analytics.

## About the design files
The files in `design-reference/` are **design references authored in HTML** — a prototype of the intended look and behavior, not production code to lift verbatim.

- `design-reference/index.html` — a standalone, dependency-free build of the design. Open it in a browser to see the intended result; it is the most faithful visual reference.
- `design-reference/Portfolio.dc.html` — the original authoring file. It uses a bespoke component runtime (`support.js`, not included) and will not render outside its authoring environment. Read it for markup structure only.
- `design-reference/organic-styles.css` — the "Organic" design-system stylesheet the design draws its type and color ramps from. The page ships a dark inversion of these tokens (see Design Tokens).

The task is to recreate this design in the target environment (Next.js/React, Astro, plain HTML — whatever the repo uses) with that project's established patterns. If there is no repo yet, this page is small enough that a static site (plain HTML/CSS, or Next.js static export if Jason wants to keep it in React) is the right call.

## Implementation requirements (from Jason — these are binding)

**Stack:** React, deployed to **GitHub Pages**.
- Vite + React is the recommended setup (`npm create vite@latest -- --template react-ts`); Jason already works in Vite. Next.js is acceptable only in static-export mode, but is more machinery than this page needs.
- Set `base` in `vite.config.ts` to `'/<repo-name>/'` if the site is served from a project page rather than `<user>.github.io`. Ship a GitHub Actions workflow (`actions/upload-pages-artifact` + `actions/deploy-pages`) that builds on push to `main` and deploys `dist/`.
- Add a `.nojekyll` file to the published output.

**DRY.** Nothing repeats. In particular:
- The 16 skill chips come from one array of strings and one `<Chip>`/`.map()` — never 16 hand-written elements.
- The link rows come from one array of `{ label, url, href }` and one `<LinkRow>`.
- Theme values live only in CSS custom properties; no color is written twice, and no hex appears in a component file.

**Modular CSS, not one stylesheet.** Use **CSS Modules** (`Component.module.css` next to each component; Vite supports them with no config). One global stylesheet only for what is genuinely global: the `:root` / `[data-theme="light"]` token blocks, the `@font-face`/font import, element resets, `:focus-visible`, `::selection`, and the `rise` keyframes. Every component's layout and skin belongs to its own module. No inline styles, no CSS-in-JS, no Tailwind here.

**BEM naming.** Class names follow `block__element--modifier` (e.g. `links__row`, `links__row--external`, `chip`, `chip--muted`, `theme-toggle__icon`). Within CSS Modules, keep the same syntax — `styles['links__row']` or camel-free bracket access; do not fall back to ad-hoc names.

**Accessibility is the top priority**, above visual polish. The "Accessibility requirements" section below is a checklist, not suggestions. Add `eslint-plugin-jsx-a11y` and run `axe` (via `@axe-core/react` in dev or `jest-axe` in tests) with zero violations before shipping.

**Efficiency and readability.** Small, single-purpose components; no premature abstraction and no state library. Derive from props where possible, memoize only if a profiler says so. Prefer clear names and short functions over comments; comment only non-obvious decisions (e.g. why the pre-paint theme script exists).

**Unit tests for every component.** Vitest + React Testing Library (Jest is fine if the repo prefers it) — test behavior, not markup:
- `ThemeToggle`: renders the sun icon in dark mode and moon in light; click flips `data-theme` on the root; `aria-label` updates with state; the choice is written to `localStorage`; a stored value is restored on mount; a `localStorage` throw does not crash the component.
- `SkillList`: renders one list item per entry in the data array; renders the exact labels; is a `<ul>` of `<li>` (list semantics preserved).
- `LinkRow` / `LinkList`: renders an accessible link per entry with the right `href` and accessible name; the arrow is hidden from assistive tech.
- `Header`: exactly one `<h1>` with the name; subtitle present.
- `App`/page: skip link is the first focusable element and targets `#main`; each section is reachable by its accessible heading name; `jest-axe` reports no violations in both themes.

## Fidelity
**High fidelity.** Colors, type, spacing, and states below are final values, taken from the shipped design. Recreate them as specified.

## Screen: Home (the only view)

**Purpose:** A visitor learns who Jason is and leaves via GitHub or LinkedIn.

**Layout**
- Page root: `min-height:100vh`, background `--color-bg`, color `--color-text`, base font-size 17px, line-height 1.65.
- Root padding: `clamp(32px,6vw,84px)` top, `clamp(20px,6vw,72px)` left/right, 72px bottom.
- Content column: `max-width:640px`, **left-aligned, not centered** (`margin:0`) — this asymmetry is intentional to the design system.
- Column is a flex column with `gap: clamp(46px,7vw,72px)` between header / main / footer; `<main>` uses the same gap between its sections.
- Everything is a single flow — no grid, no sidebars. Responsive behavior comes entirely from the clamps; there are no media queries and no separate mobile layout.

**Components**

1. **Skip link** — `<a href="#main">Skip to content</a>`. Positioned absolute, off-screen (`left:-9999px`, `top:14px`), moves to `left:clamp(20px,6vw,72px)` on `:focus`. Pill (`border-radius:999px`), padding 12px 20px, background `--color-accent`, text `--color-bg`, weight 600.

2. **Header** — flex row, `align-items:flex-start`, `justify-content:space-between`, gap 24px.
   - `<h1>` "Jason Rector" — Caprasimo 400, `font-size:clamp(36px,6.5vw,50px)`, line-height 1.06, letter-spacing -0.02em, margin 0.
   - `<p>` "Front end engineer — Columbus, Ohio" — Figtree 400, 18.5px, color `--color-muted`. (em dash, not hyphen)
   - Title block is a flex column with 8px gap.
   - **Theme toggle button** — 48×48px circle, `border:1px solid --color-divider`, transparent background, `color:--color-text`, cursor pointer. Contains a 20px Lucide-style icon at `stroke-width:2.75` — a **sun** while in dark mode, a **moon** while in light mode (the icon shows the current state's counterpart action). `aria-label` swaps between "Switch to light theme" and "Switch to dark theme". Hover: `background:--color-surface`, `border-color:--color-muted`; transition `background .18s ease, border-color .18s ease`.

3. **About section** — `aria-labelledby="about-h"` with a visually-hidden `<h2>About</h2>` (1×1px clip technique). Body is a flex column, gap 18px, `max-width:56ch`, `text-wrap:pretty`.
   - Paragraph 1 (19px, `--color-text`): "Hi, I'm Jason. I build the front end of things — the part you actually touch — and I've never quite gotten over how satisfying it is when a page just feels right."
   - Paragraph 2 (17px, `--color-muted`): "Most of my days are spent in JavaScript, React and CSS, fussing over the details that don't show up in a screenshot: keyboard paths that work, states that tell the truth, and pages that load before you notice them loading."
   - Paragraph 3 (17px, `--color-muted`): "Outside of work I'm usually somewhere in Columbus with a coffee, taking apart something that didn't need taking apart."

4. **Skills section** — heading "What I work with": Figtree 600, 13px, letter-spacing 0.12em, uppercase, `--color-muted`, margin-bottom 20px.
   - `<ul>` reset (no list-style, no padding), `display:flex; flex-wrap:wrap; gap:10px`.
   - Each `<li>` chip: padding 8px 16px, `border-radius:999px`, background `--color-surface`, font-size 15.5px, `--color-text`. Chips are **not interactive** — no hover, no links.
   - Order: JavaScript, TypeScript, HTML, CSS, Accessibility, React, Vue, React Native, Testing Library, Jest, Vite, Playwright, Claude Code, Next.js, Tailwind, Sass.

5. **Links section** — heading "Find me" (same heading style as above, margin-bottom 12px).
   - `<ul>` reset, flex column. Each `<li>` has `border-bottom:1px solid --color-divider`.
   - Each row is a full-width `<a>`: flex, `align-items:center`, gap 14px, `min-height:56px`, padding 14px 0, no underline, `color:--color-text`.
     - Label span: weight 600, 17.5px.
     - URL span: `flex:1`, 15.5px, `--color-muted`.
     - Arrow span: "→", `--color-accent`, 18px, `aria-hidden="true"`.
   - Hover/focus: `padding-left:12px` and label color → `--color-accent`; transition `padding-left .18s ease, color .18s ease`.
   - Rows: GitHub → https://github.com/JBRector (shown as `github.com/JBRector`); LinkedIn → https://www.linkedin.com/in/jason-rector-b69953/ (shown as `jason-rector`).
   - Add `rel="me"` if useful; external links intentionally open in the same tab.

6. **Footer** — 14.5px, `--color-muted`: "Built by hand in Columbus. No trackers, no cookie banner."

## Interactions & behavior
- **Theme toggle** is the only interaction. Clicking flips a `data-theme` attribute ("dark" | "light") on the page root, which re-points the CSS custom properties. The choice is written to `localStorage` under the key `jr-site-theme` and restored on load. Default when nothing is stored: **dark**.
  - In a static build, set the attribute in a tiny inline script in `<head>` before paint to avoid a flash of the wrong theme (the reference `index.html` does this).
  - Optional improvement worth taking: fall back to `prefers-color-scheme` when no stored value exists.
- **Load animation**: each block fades and rises in — `@keyframes rise { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:none } }`, `.5s ease-out both`, staggered 0 / .06s / .12s / .18s / .24s (header, about, skills, links, footer).
- **Reduced motion**: `@media (prefers-reduced-motion: reduce) { *{ animation:none !important; transition:none !important } }`.
- No loading states, no error states, no forms, no validation.

## Accessibility requirements (these are the point of the page — keep them)
- One `<h1>`; every section is a `<section aria-labelledby>` with a real `<h2>` (the About heading is visually hidden, not `display:none`).
- Skip link is the first focusable element and becomes visible on focus.
- Focus ring is themed, never removed: `:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 3px }`.
- Interactive targets are ≥46px tall (toggle 48px, link rows 56px).
- The toggle is a real `<button type="button">` with an `aria-label` describing the action it performs; the icon is `aria-hidden`.
- Decorative arrows are `aria-hidden`.
- Set `<html lang="en">`.
- Contrast: body text on ground is ~13:1 (dark) / ~14:1 (light); muted text ~6:1; the accent is used for large text, icons and chrome only.

## State management
Exactly one state value: `theme: 'dark' | 'light'`, initialized from `localStorage['jr-site-theme']`, defaulting to `'dark'`. No data fetching.

## Design tokens

Dark theme (default):
| Token | Value | Use |
| --- | --- | --- |
| `--color-bg` | `#181614` | page ground |
| `--color-surface` | `#211e1a` | skill chips |
| `--color-text` | `#f9f4ed` | body text |
| `--color-muted` | `#b6ac9c` | secondary text, borders on hover |
| `--color-divider` | `#332e28` | row rules, toggle border |
| `--color-accent` | `#f6a06b` | arrows, focus ring, skip link, link hover |

Light theme (`[data-theme="light"]`):
| Token | Value |
| --- | --- |
| `--color-bg` | `#f5ead8` |
| `--color-surface` | `#ebddc5` |
| `--color-text` | `#201e1d` |
| `--color-muted` | `#645c50` |
| `--color-divider` | `#dcd3c4` |
| `--color-accent` | `#8c491a` |

Typography
- Display: **Caprasimo** 400 — used only for the `<h1>`.
- Body: **Figtree** 400/600/700.
- Google Fonts: `https://fonts.googleapis.com/css2?family=Caprasimo&family=Figtree:wght@400;600;700&display=swap` (self-host if the repo prefers; `next/font` works fine).
- Sizes in use: 50/36px h1 (clamped), 19px lead paragraph, 18.5px subtitle, 17.5px link label, 17px body, 15.5px chips + link URLs, 14.5px footer, 13px section headings (uppercase, 0.12em tracking).

Radii: `999px` for every pill (chips, buttons, skip link). Nothing on this page uses a square corner.

Spacing: 8 / 10 / 12 / 14 / 18 / 20 / 24px locally; `clamp(46px,7vw,72px)` between sections; `clamp()` for page padding as listed above.

Shadows: none. Elevation is expressed with surface color only.

## Assets
None. No images, no logos, no icon library dependency — the two icons (sun, moon) are inline SVG paths in Lucide's style at `stroke-width:2.75`; copy them from the reference file or pull `sun` and `moon` from `lucide-react`.

## Suggested structure
```
src/
  main.tsx
  App.tsx                     // page composition only
  styles/
    tokens.css                // :root + [data-theme="light"] custom properties
    global.css                // resets, focus-visible, ::selection, @keyframes rise
  data/
    skills.ts                 // string[]
    links.ts                  // { label, url, href }[]
  hooks/
    useTheme.ts               // 'dark' | 'light', localStorage-backed
  components/
    Header/Header.tsx + Header.module.css + Header.test.tsx
    ThemeToggle/…
    About/…
    SkillList/…               // renders Chip per data entry
    LinkList/…                // renders LinkRow per data entry
    SkipLink/…
    Footer/…
```
The pre-paint theme script (inline in `index.html`, before the app mounts) prevents a flash of the wrong theme — keep it even though the hook also reads `localStorage`.

Add `<title>Jason Rector — Front end engineer</title>`, a meta description, `lang="en"`, and an OG image if link previews matter.

## Files in this bundle
- `design-reference/index.html` — standalone runnable reference (start here)
- `design-reference/Portfolio.dc.html` — original authoring source (structure reference only, does not run standalone)
- `design-reference/organic-styles.css` — the Organic design-system token sheet the palette derives from
