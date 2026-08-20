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
