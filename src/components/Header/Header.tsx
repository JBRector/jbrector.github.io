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
