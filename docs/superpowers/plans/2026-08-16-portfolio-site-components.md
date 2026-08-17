# Portfolio Site — Component Build-Out Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the seven UI components (SkipLink, Header, ThemeToggle, About, SkillList, LinkList, Footer) and compose them into the real `App.tsx`, replacing the scaffolding phase's placeholder — producing the full, accessible, themeable single-page site described in the design spec.

**Architecture:** Small, single-purpose, prop-driven React components, each with its own CSS Module (BEM class names) and its own test file testing behavior, not markup. `Chip` and `LinkRow` are nested inside their parent's folder and share the parent's CSS Module, per the spec. `App` calls `useTheme()` once and threads `theme`/`toggleTheme` down through `Header` into `ThemeToggle` — no other component touches theme state. `SkillList` and `LinkList` are the only consumers of `src/data/skills.ts` and `src/data/links.ts`, each rendering its list via a single `.map()`.

**Tech Stack:** React 19 + TypeScript (already scaffolded), CSS Modules (BEM), Vitest + React Testing Library + `@testing-library/user-event` + `vitest-axe` (all already installed and wired from the scaffolding phase).

**Spec:** `docs/superpowers/specs/2026-08-16-portfolio-site-design.md`

## Scope note

This plan builds on the completed scaffolding phase (branch `worktree-portfolio-site-scaffolding`, commits `bb37fb5`..`7659a30`): a working Vite+React+TS project, `src/styles/tokens.css` + `global.css`, `src/data/skills.ts` + `links.ts`, and `src/hooks/useTheme.ts` all already exist and are not touched except where a task explicitly says so. This plan covers the 7 UI components, their 2 nested subcomponents (`Chip`, `LinkRow`) and 2 icon subcomponents (`SunIcon`, `MoonIcon`), and the final `App.tsx`/`App.test.tsx` that replace Task 1's placeholder from the scaffolding plan. The GitHub Actions deploy workflow is a separate, later plan — not covered here.

One deliberate addition beyond the design spec's original file listing: `src/App.module.css`. The spec's "no inline styles, no CSS-in-JS" constraint applies to `App` exactly as it does to every other component — the page's outer layout (max-width wrapper, vertical gap between header/main/footer) needs a home, and a global stylesheet is the wrong place for a single component's layout. `App` gets a CSS Module like everything else.

## Global Constraints

(From the spec — apply to every task below.)

- CSS Modules per component (`Component.module.css`); BEM class names (`block__element--modifier`) within them. No inline styles, no CSS-in-JS, no Tailwind.
- Accessibility is the top priority. Every interactive element must be keyboard-reachable with a visible focus ring (already handled globally by `:focus-visible` in `global.css`). Decorative icons and glyphs get `aria-hidden="true"`. `eslint-plugin-jsx-a11y` is already wired into lint (scaffolding phase) — `npm run lint` must stay clean.
- DRY: the 16 skill chips and the link rows must come from `src/data/skills.ts` / `src/data/links.ts` via exactly one `.map()` each — no hand-written repeated elements.
- Small, single-purpose components; no premature abstraction, no state library; derive from props where possible. `useTheme()` is called exactly once, in `App`.
- `rel="me"` on both link rows (GitHub, LinkedIn).
- `old/` is a superseded prior attempt — never modify it, never copy from it.
- Design tokens (`--color-bg`, `--color-surface`, `--color-text`, `--color-muted`, `--color-divider`, `--color-accent`, `--font-heading`, `--font-body`) and the `rise` keyframe already exist in `src/styles/tokens.css` / `global.css` — components reference them by name, never redefine them.

---

### Task 1: SkipLink

**Files:**
- Create: `src/components/SkipLink/SkipLink.tsx`
- Create: `src/components/SkipLink/SkipLink.module.css`
- Create: `src/components/SkipLink/SkipLink.test.tsx`

**Interfaces:**
- Consumes: nothing.
- Produces: `SkipLink` (default export, `src/components/SkipLink/SkipLink.tsx`, no props) — Task 8's `App` renders this first, before `Header`.

- [ ] **Step 1: Write the failing test**

Create `src/components/SkipLink/SkipLink.test.tsx`:

```tsx
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import SkipLink from './SkipLink';

describe('SkipLink', () => {
  it('renders a link to the #main landmark', () => {
    render(<SkipLink />);
    const link = screen.getByRole('link', { name: 'Skip to content' });
    expect(link).toHaveAttribute('href', '#main');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/components/SkipLink --reporter=verbose`
Expected: FAIL — `Cannot find module './SkipLink'`.

- [ ] **Step 3: Write the implementation**

Create `src/components/SkipLink/SkipLink.module.css`:

```css
.skip-link {
  position: absolute;
  left: -9999px;
  top: 14px;
  padding: 12px 20px;
  border-radius: 999px;
  background: var(--color-accent);
  color: var(--color-bg);
  font-weight: 600;
  text-decoration: none;
  z-index: 9;
}

.skip-link:focus {
  left: clamp(20px, 6vw, 72px);
}
```

Create `src/components/SkipLink/SkipLink.tsx`:

```tsx
import styles from './SkipLink.module.css';

export default function SkipLink() {
  return (
    <a className={styles['skip-link']} href="#main">
      Skip to content
    </a>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/components/SkipLink --reporter=verbose`
Expected: PASS (1 test)

- [ ] **Step 5: Typecheck and lint**

Run: `npm run typecheck && npm run lint`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/SkipLink/
git commit -m "Add SkipLink component"
```

---

### Task 2: ThemeToggle (+ SunIcon, MoonIcon)

**Files:**
- Create: `src/components/ThemeToggle/SunIcon.tsx`
- Create: `src/components/ThemeToggle/MoonIcon.tsx`
- Create: `src/components/ThemeToggle/ThemeToggle.tsx`
- Create: `src/components/ThemeToggle/ThemeToggle.module.css`
- Create: `src/components/ThemeToggle/ThemeToggle.test.tsx`

**Interfaces:**
- Consumes: `Theme` type from `src/hooks/useTheme.ts` (already exists: `export type Theme = 'dark' | 'light';`).
- Produces: `ThemeToggle` (default export, props `{ theme: Theme; onToggle: () => void }`) from `src/components/ThemeToggle/ThemeToggle.tsx` — Task 3's `Header` renders this. `SunIcon`/`MoonIcon` (default exports, no props) are internal to this folder only; no other task imports them directly.

- [ ] **Step 1: Write the failing tests**

Create `src/components/ThemeToggle/ThemeToggle.test.tsx`:

```tsx
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ThemeToggle from './ThemeToggle';

describe('ThemeToggle', () => {
  it('shows a "switch to light" label and the sun icon while dark', () => {
    render(<ThemeToggle theme="dark" onToggle={vi.fn()} />);
    const button = screen.getByRole('button', { name: 'Switch to light theme' });
    expect(button.querySelector('circle')).toBeInTheDocument();
  });

  it('shows a "switch to dark" label and the moon icon while light', () => {
    render(<ThemeToggle theme="light" onToggle={vi.fn()} />);
    const button = screen.getByRole('button', { name: 'Switch to dark theme' });
    expect(button.querySelector('circle')).not.toBeInTheDocument();
  });

  it('calls onToggle when clicked', async () => {
    const onToggle = vi.fn();
    const user = userEvent.setup();
    render(<ThemeToggle theme="dark" onToggle={onToggle} />);
    await user.click(screen.getByRole('button'));
    expect(onToggle).toHaveBeenCalledOnce();
  });

  it('hides its icon from assistive tech', () => {
    render(<ThemeToggle theme="dark" onToggle={vi.fn()} />);
    const svg = screen.getByRole('button').querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/components/ThemeToggle --reporter=verbose`
Expected: FAIL — `Cannot find module './ThemeToggle'`.

- [ ] **Step 3: Write the implementation**

Create `src/components/ThemeToggle/SunIcon.tsx`:

```tsx
export default function SunIcon() {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx={12} cy={12} r={4} />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}
```

Create `src/components/ThemeToggle/MoonIcon.tsx`:

```tsx
export default function MoonIcon() {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  );
}
```

Create `src/components/ThemeToggle/ThemeToggle.module.css`:

```css
.theme-toggle {
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 999px;
  border: 1px solid var(--color-divider);
  background: transparent;
  color: var(--color-text);
  cursor: pointer;
  transition:
    background 0.18s ease,
    border-color 0.18s ease;
}

.theme-toggle:hover {
  background: var(--color-surface);
  border-color: var(--color-muted);
}
```

Create `src/components/ThemeToggle/ThemeToggle.tsx`:

```tsx
import type { Theme } from '../../hooks/useTheme';
import SunIcon from './SunIcon';
import MoonIcon from './MoonIcon';
import styles from './ThemeToggle.module.css';

export interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
}

export default function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isDark = theme === 'dark';
  const label = isDark ? 'Switch to light theme' : 'Switch to dark theme';

  return (
    <button type="button" className={styles['theme-toggle']} aria-label={label} onClick={onToggle}>
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/components/ThemeToggle --reporter=verbose`
Expected: PASS (4 tests)

- [ ] **Step 5: Typecheck and lint**

Run: `npm run typecheck && npm run lint`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/ThemeToggle/
git commit -m "Add ThemeToggle component with inline sun/moon icons"
```

---

### Task 3: Header

**Files:**
- Create: `src/components/Header/Header.tsx`
- Create: `src/components/Header/Header.module.css`
- Create: `src/components/Header/Header.test.tsx`

**Interfaces:**
- Consumes: `Theme` type from `src/hooks/useTheme.ts`; `ThemeToggle` (default export) from `src/components/ThemeToggle/ThemeToggle.tsx` (Task 2).
- Produces: `Header` (default export, props `{ theme: Theme; onToggleTheme: () => void }`) — Task 8's `App` renders this with `theme`/`toggleTheme` from `useTheme()`.

- [ ] **Step 1: Write the failing tests**

Create `src/components/Header/Header.test.tsx`:

```tsx
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from './Header';

describe('Header', () => {
  it('renders exactly one h1 with the name', () => {
    render(<Header theme="dark" onToggleTheme={vi.fn()} />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1, name: 'Jason Rector' })).toBeInTheDocument();
  });

  it('renders the subtitle', () => {
    render(<Header theme="dark" onToggleTheme={vi.fn()} />);
    expect(screen.getByText('Front end engineer — Columbus, Ohio')).toBeInTheDocument();
  });

  it('forwards a toggle click to onToggleTheme', async () => {
    const onToggleTheme = vi.fn();
    const user = userEvent.setup();
    render(<Header theme="dark" onToggleTheme={onToggleTheme} />);
    await user.click(screen.getByRole('button', { name: 'Switch to light theme' }));
    expect(onToggleTheme).toHaveBeenCalledOnce();
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/components/Header --reporter=verbose`
Expected: FAIL — `Cannot find module './Header'`.

- [ ] **Step 3: Write the implementation**

Create `src/components/Header/Header.module.css`:

```css
.header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  animation: rise 0.5s ease-out both;
}

.header__name-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.header__heading {
  font-family: var(--font-heading);
  font-weight: 400;
  font-size: clamp(36px, 6.5vw, 50px);
  line-height: 1.06;
  letter-spacing: -0.02em;
  margin: 0;
}

.header__subtitle {
  margin: 0;
  font-size: 18.5px;
  color: var(--color-muted);
}
```

Create `src/components/Header/Header.tsx`:

```tsx
import type { Theme } from '../../hooks/useTheme';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import styles from './Header.module.css';

export interface HeaderProps {
  theme: Theme;
  onToggleTheme: () => void;
}

export default function Header({ theme, onToggleTheme }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles['header__name-block']}>
        <h1 className={styles['header__heading']}>Jason Rector</h1>
        <p className={styles['header__subtitle']}>Front end engineer — Columbus, Ohio</p>
      </div>
      <ThemeToggle theme={theme} onToggle={onToggleTheme} />
    </header>
  );
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/components/Header --reporter=verbose`
Expected: PASS (3 tests)

- [ ] **Step 5: Typecheck and lint**

Run: `npm run typecheck && npm run lint`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/Header/
git commit -m "Add Header component"
```

---

### Task 4: About

**Files:**
- Create: `src/components/About/About.tsx`
- Create: `src/components/About/About.module.css`
- Create: `src/components/About/About.test.tsx`

**Interfaces:**
- Consumes: nothing.
- Produces: `About` (default export, no props) — Task 8's `App` renders this inside `<main>`.

- [ ] **Step 1: Write the failing tests**

Create `src/components/About/About.test.tsx`:

```tsx
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import About from './About';

describe('About', () => {
  it('has a visually-hidden "About" heading labelling the section', () => {
    render(<About />);
    expect(screen.getByRole('heading', { level: 2, name: 'About' })).toBeInTheDocument();
  });

  it('renders all three bio paragraphs', () => {
    render(<About />);
    expect(screen.getByText(/Hi, I'm Jason/)).toBeInTheDocument();
    expect(screen.getByText(/Most of my days/)).toBeInTheDocument();
    expect(screen.getByText(/Outside of work/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/components/About --reporter=verbose`
Expected: FAIL — `Cannot find module './About'`.

- [ ] **Step 3: Write the implementation**

Create `src/components/About/About.module.css`:

```css
.about {
  animation: rise 0.5s ease-out 0.06s both;
}

.about__heading {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

.about__prose {
  display: flex;
  flex-direction: column;
  gap: 18px;
  max-width: 56ch;
  text-wrap: pretty;
}

.about__paragraph {
  margin: 0;
  color: var(--color-muted);
}

.about__paragraph--lead {
  font-size: 19px;
  color: var(--color-text);
}
```

Create `src/components/About/About.tsx`:

```tsx
import styles from './About.module.css';

export default function About() {
  return (
    <section aria-labelledby="about-h" className={styles.about}>
      <h2 id="about-h" className={styles['about__heading']}>
        About
      </h2>
      <div className={styles['about__prose']}>
        <p className={`${styles['about__paragraph']} ${styles['about__paragraph--lead']}`}>
          Hi, I&apos;m Jason. I build the front end of things — the part you actually touch — and
          I&apos;ve never quite gotten over how satisfying it is when a page just feels right.
        </p>
        <p className={styles['about__paragraph']}>
          Most of my days are spent in JavaScript, React and CSS, fussing over the details that
          don&apos;t show up in a screenshot: keyboard paths that work, states that tell the truth,
          and pages that load before you notice them loading.
        </p>
        <p className={styles['about__paragraph']}>
          Outside of work I&apos;m usually somewhere in Columbus with a coffee, taking apart
          something that didn&apos;t need taking apart.
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/components/About --reporter=verbose`
Expected: PASS (2 tests)

- [ ] **Step 5: Typecheck and lint**

Run: `npm run typecheck && npm run lint`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/About/
git commit -m "Add About component"
```

---

### Task 5: SkillList (+ Chip)

**Files:**
- Create: `src/components/SkillList/Chip.tsx`
- Create: `src/components/SkillList/SkillList.tsx`
- Create: `src/components/SkillList/SkillList.module.css`
- Create: `src/components/SkillList/SkillList.test.tsx`

**Interfaces:**
- Consumes: `skills` (`readonly string[]`) from `src/data/skills.ts` (already exists, 16 entries).
- Produces: `SkillList` (default export, no props) — Task 8's `App` renders this inside `<main>`. `Chip` (default export, props `{ label: string }`) is internal to this folder only.

- [ ] **Step 1: Write the failing tests**

Create `src/components/SkillList/SkillList.test.tsx`:

```tsx
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import SkillList from './SkillList';
import { skills } from '../../data/skills';

describe('SkillList', () => {
  it('renders one list item per skill, from the data source', () => {
    render(<SkillList />);
    expect(screen.getAllByRole('listitem')).toHaveLength(skills.length);
  });

  it('renders each skill name as text', () => {
    render(<SkillList />);
    for (const skill of skills) {
      expect(screen.getByText(skill)).toBeInTheDocument();
    }
  });

  it('labels the section with a heading', () => {
    render(<SkillList />);
    expect(screen.getByRole('heading', { level: 2, name: 'What I work with' })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/components/SkillList --reporter=verbose`
Expected: FAIL — `Cannot find module './SkillList'`.

- [ ] **Step 3: Write the implementation**

Create `src/components/SkillList/SkillList.module.css`:

```css
.skills {
  animation: rise 0.5s ease-out 0.12s both;
}

.skills__heading {
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-muted);
  margin: 0 0 20px;
}

.skills__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.chip {
  padding: 8px 16px;
  border-radius: 999px;
  background: var(--color-surface);
  font-size: 15.5px;
}
```

Create `src/components/SkillList/Chip.tsx`:

```tsx
import styles from './SkillList.module.css';

export interface ChipProps {
  label: string;
}

export default function Chip({ label }: ChipProps) {
  return <li className={styles.chip}>{label}</li>;
}
```

Create `src/components/SkillList/SkillList.tsx`:

```tsx
import { skills } from '../../data/skills';
import Chip from './Chip';
import styles from './SkillList.module.css';

export default function SkillList() {
  return (
    <section aria-labelledby="skills-h" className={styles.skills}>
      <h2 id="skills-h" className={styles['skills__heading']}>
        What I work with
      </h2>
      <ul className={styles['skills__list']}>
        {skills.map((skill) => (
          <Chip key={skill} label={skill} />
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/components/SkillList --reporter=verbose`
Expected: PASS (3 tests)

- [ ] **Step 5: Typecheck and lint**

Run: `npm run typecheck && npm run lint`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/SkillList/
git commit -m "Add SkillList component with Chip, driven by data/skills.ts"
```

---

### Task 6: LinkList (+ LinkRow)

**Files:**
- Create: `src/components/LinkList/LinkRow.tsx`
- Create: `src/components/LinkList/LinkList.tsx`
- Create: `src/components/LinkList/LinkList.module.css`
- Create: `src/components/LinkList/LinkList.test.tsx`

**Interfaces:**
- Consumes: `links` (`readonly LinkEntry[]`) from `src/data/links.ts` (already exists, 2 entries: GitHub, LinkedIn).
- Produces: `LinkList` (default export, no props) — Task 8's `App` renders this inside `<main>`. `LinkRow` (default export, props `{ label: string; url: string; href: string }`) is internal to this folder only.

- [ ] **Step 1: Write the failing tests**

Create `src/components/LinkList/LinkList.test.tsx`:

```tsx
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import LinkList from './LinkList';
import { links } from '../../data/links';

describe('LinkList', () => {
  it('renders one accessible link per entry, from the data source, with rel="me"', () => {
    render(<LinkList />);
    for (const link of links) {
      const anchor = screen.getByRole('link', { name: new RegExp(`^${link.label}`) });
      expect(anchor).toHaveAttribute('href', link.href);
      expect(anchor).toHaveAttribute('rel', 'me');
    }
  });

  it('hides the decorative arrow from assistive tech', () => {
    render(<LinkList />);
    const hidden = document.querySelectorAll('[aria-hidden="true"]');
    expect(hidden).toHaveLength(links.length);
  });

  it('labels the section with a heading', () => {
    render(<LinkList />);
    expect(screen.getByRole('heading', { level: 2, name: 'Find me' })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/components/LinkList --reporter=verbose`
Expected: FAIL — `Cannot find module './LinkList'`.

- [ ] **Step 3: Write the implementation**

Create `src/components/LinkList/LinkList.module.css`:

```css
.links {
  animation: rise 0.5s ease-out 0.18s both;
}

.links__heading {
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-muted);
  margin: 0 0 12px;
}

.links__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.links__item {
  border-bottom: 1px solid var(--color-divider);
}

.links__row {
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 56px;
  padding: 14px 0;
  text-decoration: none;
  color: var(--color-text);
  transition:
    padding-left 0.18s ease,
    color 0.18s ease;
}

.links__row:hover,
.links__row:focus-visible {
  padding-left: 12px;
  color: var(--color-accent);
}

.links__label {
  font-weight: 600;
  font-size: 17.5px;
}

.links__url {
  flex: 1;
  color: var(--color-muted);
  font-size: 15.5px;
}

.links__arrow {
  color: var(--color-accent);
  font-size: 18px;
}
```

Create `src/components/LinkList/LinkRow.tsx`:

```tsx
import styles from './LinkList.module.css';

export interface LinkRowProps {
  label: string;
  url: string;
  href: string;
}

export default function LinkRow({ label, url, href }: LinkRowProps) {
  return (
    <li className={styles['links__item']}>
      <a className={styles['links__row']} href={href} rel="me">
        <span className={styles['links__label']}>{label}</span>
        <span className={styles['links__url']}>{url}</span>
        <span className={styles['links__arrow']} aria-hidden="true">
          →
        </span>
      </a>
    </li>
  );
}
```

Create `src/components/LinkList/LinkList.tsx`:

```tsx
import { links } from '../../data/links';
import LinkRow from './LinkRow';
import styles from './LinkList.module.css';

export default function LinkList() {
  return (
    <section aria-labelledby="links-h" className={styles.links}>
      <h2 id="links-h" className={styles['links__heading']}>
        Find me
      </h2>
      <ul className={styles['links__list']}>
        {links.map((link) => (
          <LinkRow key={link.label} label={link.label} url={link.url} href={link.href} />
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/components/LinkList --reporter=verbose`
Expected: PASS (3 tests)

- [ ] **Step 5: Typecheck and lint**

Run: `npm run typecheck && npm run lint`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/LinkList/
git commit -m "Add LinkList component with LinkRow, driven by data/links.ts"
```

---

### Task 7: Footer

**Files:**
- Create: `src/components/Footer/Footer.tsx`
- Create: `src/components/Footer/Footer.module.css`
- Create: `src/components/Footer/Footer.test.tsx`

**Interfaces:**
- Consumes: nothing.
- Produces: `Footer` (default export, no props) — Task 8's `App` renders this last, after `<main>`.

- [ ] **Step 1: Write the failing test**

Create `src/components/Footer/Footer.test.tsx`:

```tsx
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
  it('renders the placeholder footer copy', () => {
    render(<Footer />);
    expect(
      screen.getByText('Why do programmers prefer dark mode? Because light attracts bugs.'),
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/components/Footer --reporter=verbose`
Expected: FAIL — `Cannot find module './Footer'`.

- [ ] **Step 3: Write the implementation**

Create `src/components/Footer/Footer.module.css`:

```css
.footer {
  color: var(--color-muted);
  font-size: 14.5px;
  animation: rise 0.5s ease-out 0.24s both;
}

.footer__text {
  margin: 0;
}
```

Create `src/components/Footer/Footer.tsx`:

```tsx
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles['footer__text']}>
        Why do programmers prefer dark mode? Because light attracts bugs.
      </p>
    </footer>
  );
}
```

(This is placeholder copy — see the design spec's "Open items". Swap before shipping.)

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/components/Footer --reporter=verbose`
Expected: PASS (1 test)

- [ ] **Step 5: Typecheck and lint**

Run: `npm run typecheck && npm run lint`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/Footer/
git commit -m "Add Footer component with placeholder copy"
```

---

### Task 8: App composition

**Files:**
- Create: `src/App.module.css`
- Modify: `src/App.tsx` (replace the scaffolding placeholder entirely)
- Modify: `src/App.test.tsx` (replace the scaffolding smoke test entirely)

**Interfaces:**
- Consumes: `useTheme` from `src/hooks/useTheme.ts`; `SkipLink`, `Header`, `About`, `SkillList`, `LinkList`, `Footer` (default exports from Tasks 1–7).
- Produces: the final `App` (default export, `src/App.tsx`) — this is the last task in this plan; `src/main.tsx` already imports and renders `App` unchanged since the scaffolding phase.

- [ ] **Step 1: Write the failing tests**

Replace `src/App.test.tsx` entirely with:

```tsx
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import App from './App';

afterEach(() => {
  cleanup();
  document.documentElement.removeAttribute('data-theme');
});

describe('App', () => {
  it('renders exactly one h1', () => {
    render(<App />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  });

  it('tabs to the skip link first', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.tab();
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveFocus();
  });

  it('has a main landmark matching the skip link target', () => {
    render(<App />);
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main');
  });

  it('exposes About, What I work with, and Find me as navigable headings', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 2, name: 'About' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'What I work with' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Find me' })).toBeInTheDocument();
  });

  it('has no axe violations in dark mode', async () => {
    document.documentElement.dataset.theme = 'dark';
    const { container } = render(<App />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations in light mode', async () => {
    document.documentElement.dataset.theme = 'light';
    const { container } = render(<App />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npx vitest run src/App.test.tsx --reporter=verbose`
Expected: FAIL — 3 of 6 tests fail against the old placeholder `App` (no skip link to tab to, no `#main` landmark, none of the three section headings exist). "renders exactly one h1" and both axe checks pass trivially against the placeholder, since a bare `<h1>` has nothing to violate — that's expected too, not a sign of a broken test.

- [ ] **Step 3: Write the implementation**

Create `src/App.module.css`:

```css
.app {
  max-width: 640px;
  display: flex;
  flex-direction: column;
  gap: clamp(46px, 7vw, 72px);
}

.app__main {
  display: flex;
  flex-direction: column;
  gap: clamp(46px, 7vw, 72px);
}
```

Replace `src/App.tsx` entirely with:

```tsx
import { useTheme } from './hooks/useTheme';
import SkipLink from './components/SkipLink/SkipLink';
import Header from './components/Header/Header';
import About from './components/About/About';
import SkillList from './components/SkillList/SkillList';
import LinkList from './components/LinkList/LinkList';
import Footer from './components/Footer/Footer';
import styles from './App.module.css';

export default function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={styles.app}>
      <SkipLink />
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <main id="main" className={styles['app__main']}>
        <About />
        <SkillList />
        <LinkList />
      </main>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/App.test.tsx --reporter=verbose`
Expected: PASS (6 tests)

- [ ] **Step 5: Typecheck and lint**

Run: `npm run typecheck && npm run lint`
Expected: no errors.

- [ ] **Step 6: Run the full test suite and build**

Run: `npm test && npm run build`
Expected: every test file passes (App + all 7 component test files + existing data/hook/theme-sync tests from the scaffolding phase); build succeeds with no errors.

- [ ] **Step 7: Commit**

```bash
git add src/App.tsx src/App.test.tsx src/App.module.css
git commit -m "Compose App from the real page components, replacing the placeholder"
```

---

## After this plan

With this merged, the final remaining plan adds the GitHub Actions deploy workflow (`.github/workflows/deploy.yml`, using `npm ci` — not `npm install`, per the scaffolding phase's `.npmrc` — building with `base: '/jasonrector/'`, and publishing `dist/` including `.nojekyll` via `actions/upload-pages-artifact` + `actions/deploy-pages`).
