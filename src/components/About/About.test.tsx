import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import About from './About';

describe('About', () => {
  it('has a visually-hidden "About" heading labelling the section', () => {
    render(<About />);
    expect(screen.getByRole('heading', { level: 2, name: 'About' })).toBeInTheDocument();
  });

  it('renders all three bio paragraphs', () => {
    render(<About />);
    expect(screen.getByText(/Hi, I'm Jason/)).toBeInTheDocument();
    expect(screen.getByText(/Most of my days/)).toBeInTheDocument();
    expect(screen.getByText(/Outside of work/)).toBeInTheDocument();
  });
});
