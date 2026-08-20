import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from './Header';

describe('Header', () => {
  it('renders exactly one h1 with the name', () => {
    render(<Header theme="dark" onToggleTheme={vi.fn()} />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1, name: 'Jason Rector' })).toBeInTheDocument();
  });

  it('renders the subtitle', () => {
    render(<Header theme="dark" onToggleTheme={vi.fn()} />);
    expect(screen.getByText('Front end engineer — Columbus, Ohio')).toBeInTheDocument();
  });

  it('forwards a toggle click to onToggleTheme', async () => {
    const onToggleTheme = vi.fn();
    const user = userEvent.setup();
    render(<Header theme="dark" onToggleTheme={onToggleTheme} />);
    await user.click(screen.getByRole('button', { name: 'Switch to light theme' }));
    expect(onToggleTheme).toHaveBeenCalledOnce();
  });
});
