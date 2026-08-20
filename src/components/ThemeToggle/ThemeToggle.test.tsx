import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ThemeToggle from './ThemeToggle';

describe('ThemeToggle', () => {
  it('shows a "switch to light" label and the sun icon while dark', () => {
    render(<ThemeToggle theme="dark" onToggle={vi.fn()} />);
    const button = screen.getByRole('button', { name: 'Switch to light theme' });
    expect(button.querySelector('circle')).toBeInTheDocument();
  });

  it('shows a "switch to dark" label and the moon icon while light', () => {
    render(<ThemeToggle theme="light" onToggle={vi.fn()} />);
    const button = screen.getByRole('button', { name: 'Switch to dark theme' });
    expect(button.querySelector('circle')).not.toBeInTheDocument();
  });

  it('calls onToggle when clicked', async () => {
    const onToggle = vi.fn();
    const user = userEvent.setup();
    render(<ThemeToggle theme="dark" onToggle={onToggle} />);
    await user.click(screen.getByRole('button', { name: 'Switch to light theme' }));
    expect(onToggle).toHaveBeenCalledOnce();
  });

  it('hides its icon from assistive tech', () => {
    render(<ThemeToggle theme="dark" onToggle={vi.fn()} />);
    const svg = screen.getByRole('button').querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });
});
