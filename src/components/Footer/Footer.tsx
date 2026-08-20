import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles['footer__text']}>&copy; Jason Rector, 2026. The Dude abides.</p>
    </footer>
  );
}
