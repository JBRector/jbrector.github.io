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
