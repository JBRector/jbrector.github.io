import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import SkillList from './SkillList';
import { skills } from '../../data/skills';

describe('SkillList', () => {
  it('renders one list item per skill, from the data source', () => {
    render(<SkillList />);
    expect(screen.getAllByRole('listitem')).toHaveLength(skills.length);
  });

  it('renders each skill name as text', () => {
    render(<SkillList />);
    for (const skill of skills) {
      expect(screen.getByText(skill)).toBeInTheDocument();
    }
  });

  it('labels the section with a heading', () => {
    render(<SkillList />);
    expect(screen.getByRole('heading', { level: 2, name: 'What I work with' })).toBeInTheDocument();
  });
});
