import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
  it('renders the footer copy', () => {
    render(<Footer />);
    expect(screen.getByText('© Jason Rector, 2026. The Dude abides.')).toBeInTheDocument();
  });
});
