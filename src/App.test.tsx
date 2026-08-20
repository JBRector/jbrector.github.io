import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import App from './App';

afterEach(() => {
  cleanup();
  document.documentElement.removeAttribute('data-theme');
});

describe('App', () => {
  it('renders exactly one h1', () => {
    render(<App />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  });

  it('tabs to the skip link first', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.tab();
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveFocus();
  });

  it('has a main landmark matching the skip link target', () => {
    render(<App />);
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main');
  });

  it('exposes About, What I work with, and Find me as navigable headings', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 2, name: 'About' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'What I work with' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Find me' })).toBeInTheDocument();
  });

  it('has no axe violations in dark mode', async () => {
    document.documentElement.dataset.theme = 'dark';
    const { container } = render(<App />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations in light mode', async () => {
    document.documentElement.dataset.theme = 'light';
    const { container } = render(<App />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
