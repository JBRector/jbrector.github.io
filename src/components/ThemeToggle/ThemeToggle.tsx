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
