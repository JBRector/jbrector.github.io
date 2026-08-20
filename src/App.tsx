import { useTheme } from './hooks/useTheme';
import { SkipLink, Header, About, SkillList, LinkList, Footer } from './components';
import styles from './App.module.css';

export default function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={styles.app}>
      <SkipLink />
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <main id="main" tabIndex={-1} className={styles['app__main']}>
        <About />
        <SkillList />
        <LinkList />
      </main>
      <Footer />
    </div>
  );
}
