import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Rozszerzenie expectacji testowych o matchers z testing-library
expect.extend(matchers);

// Automatyczne czyszczenie po każdym teście
afterEach(() => {
  cleanup();
}); 