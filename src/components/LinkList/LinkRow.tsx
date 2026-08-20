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
