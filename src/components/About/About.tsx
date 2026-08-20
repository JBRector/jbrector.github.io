import styles from './About.module.css';

export default function About() {
  return (
    <section aria-labelledby="about-h" className={styles.about}>
      <h2 id="about-h" className={styles['about__heading']}>
        About
      </h2>
      <div className={styles['about__prose']}>
        <p className={`${styles['about__paragraph']} ${styles['about__paragraph--lead']}`}>
          Hi, I'm Jason. I live in Columbus and love to build good UI.
        </p>
        <p className={styles['about__paragraph']}>
          I'm passionate about building fun, usable, performant and accessible products for the web
          and mobile.
        </p>
        <p className={styles['about__paragraph']}>
          Outside of work I enjoy spending time in the Columbus metro parks, probably with a coffee.
          That, or watching The Big Lebowski.
        </p>
      </div>
    </section>
  );
}
