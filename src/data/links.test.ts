import { describe, expect, it } from 'vitest';
import { links } from './links';

describe('links', () => {
  it('contains a GitHub entry pointing at the right profile', () => {
    const github = links.find((link) => link.label === 'GitHub');
    expect(github).toEqual({
      label: 'GitHub',
      url: 'github.com/JBRector',
      href: 'https://github.com/JBRector',
    });
  });

  it('contains a LinkedIn entry pointing at the right profile', () => {
    const linkedin = links.find((link) => link.label === 'LinkedIn');
    expect(linkedin).toEqual({
      label: 'LinkedIn',
      url: 'jason-rector',
      href: 'https://www.linkedin.com/in/jason-rector-b69953/',
    });
  });
});
