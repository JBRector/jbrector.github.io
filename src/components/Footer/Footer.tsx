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
