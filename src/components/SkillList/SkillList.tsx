import { skills } from '../../data/skills';
import Chip from './Chip';
import styles from './SkillList.module.css';

export default function SkillList() {
  return (
    <section aria-labelledby="skills-h" className={styles.skills}>
      <h2 id="skills-h" className={styles['skills__heading']}>
        What I work with
      </h2>
      <ul className={styles['skills__list']}>
        {skills.map((skill) => (
          <Chip key={skill} label={skill} />
        ))}
      </ul>
    </section>
  );
}
