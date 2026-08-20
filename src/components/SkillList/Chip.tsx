import styles from './SkillList.module.css';

export interface ChipProps {
  label: string;
}

export default function Chip({ label }: ChipProps) {
  return <li className={styles.chip}>{label}</li>;
}
