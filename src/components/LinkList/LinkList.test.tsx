import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import LinkList from './LinkList';
import { links } from '../../data/links';

describe('LinkList', () => {
  it('renders one accessible link per entry, from the data source, with rel="me"', () => {
    render(<LinkList />);
    for (const link of links) {
      const anchor = screen.getByRole('link', { name: new RegExp(`^${link.label}`) });
      expect(anchor).toHaveAttribute('href', link.href);
      expect(anchor).toHaveAttribute('rel', 'me');
    }
  });

  it('hides the decorative arrow from assistive tech', () => {
    render(<LinkList />);
    const hidden = document.querySelectorAll('[aria-hidden="true"]');
    expect(hidden).toHaveLength(links.length);
  });

  it('labels the section with a heading', () => {
    render(<LinkList />);
    expect(screen.getByRole('heading', { level: 2, name: 'Find me' })).toBeInTheDocument();
  });
});
