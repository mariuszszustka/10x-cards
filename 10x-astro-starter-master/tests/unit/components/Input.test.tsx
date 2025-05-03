import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { Input } from '../../../src/components/ui/input';

// Pomocniczy moduł @/lib/utils
vi.mock('@/lib/utils', () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(' '),
}));

describe('Input component', () => {
  it('renders correctly with default props', () => {
    render(<Input placeholder="Test Input" />);
    
    const inputElement = screen.getByPlaceholderText('Test Input');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('type', 'text');
  });

  it('applies different input types correctly', () => {
    render(<Input type="password" placeholder="Password Input" />);
    
    const inputElement = screen.getByPlaceholderText('Password Input');
    expect(inputElement).toHaveAttribute('type', 'password');
  });

  it('handles disabled state correctly', () => {
    render(<Input disabled placeholder="Disabled Input" />);
    
    const inputElement = screen.getByPlaceholderText('Disabled Input');
    expect(inputElement).toBeDisabled();
  });

  it('handles value changes and input events', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    
    render(<Input placeholder="Interactive Input" onChange={handleChange} />);
    
    const inputElement = screen.getByPlaceholderText('Interactive Input');
    await user.type(inputElement, 'Test value');
    
    expect(handleChange).toHaveBeenCalled();
  });

  it('forwards refs correctly', () => {
    const ref = React.createRef<HTMLInputElement>();
    
    render(<Input ref={ref} placeholder="Ref Input" />);
    
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe('INPUT');
  });

  it('accepts and applies additional className', () => {
    render(<Input className="custom-class" placeholder="Styled Input" />);
    
    const inputElement = screen.getByPlaceholderText('Styled Input');
    expect(inputElement).toHaveClass('custom-class');
  });
}); 