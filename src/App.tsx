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
      <main id="main" tabIndex={-1} className={styles['app__main']}>
        <About />
        <SkillList />
        <LinkList />
      </main>
      <Footer />
    </div>
  );
}
