import { describe, expect, it } from 'vitest';
import { skills } from './skills';

describe('skills', () => {
  it('contains 16 entries with no duplicates', () => {
    expect(skills).toHaveLength(16);
    expect(new Set(skills).size).toBe(skills.length);
  });
});
