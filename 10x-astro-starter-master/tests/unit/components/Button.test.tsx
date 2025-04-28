import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../../../src/components/ui/button';

// Pomocniczy moduł @/lib/utils
vi.mock('@/lib/utils', () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(' '),
}));

describe('Button component', () => {
  it('renders correctly with default props', () => {
    render(<Button>Test Button</Button>);
    
    const buttonElement = screen.getByRole('button', { name: /test button/i });
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveClass('bg-primary');
  });

  it('applies variant classes correctly', () => {
    render(<Button variant="destructive">Destructive Button</Button>);
    
    const buttonElement = screen.getByRole('button', { name: /destructive button/i });
    expect(buttonElement).toHaveClass('bg-destructive');
  });

  it('applies size classes correctly', () => {
    render(<Button size="sm">Small Button</Button>);
    
    const buttonElement = screen.getByRole('button', { name: /small button/i });
    expect(buttonElement).toHaveClass('h-8');
  });

  it('handles click events', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick}>Clickable Button</Button>);
    
    const buttonElement = screen.getByRole('button', { name: /clickable button/i });
    await user.click(buttonElement);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders as a custom element when asChild is true', () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    );
    
    const linkElement = screen.getByRole('link', { name: /link button/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', '/test');
    expect(linkElement).toHaveClass('bg-primary');
  });
}); 