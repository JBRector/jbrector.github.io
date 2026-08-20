import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
  it('renders the placeholder footer copy', () => {
    render(<Footer />);
    expect(
      screen.getByText('Why do programmers prefer dark mode? Because light attracts bugs.'),
    ).toBeInTheDocument();
  });
});
