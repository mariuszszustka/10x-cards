import { expect, afterEach, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Rozszerzenie expectacji testowych o matchers z testing-library
expect.extend(matchers);

// Automatyczne czyszczenie po każdym teście
afterEach(() => {
  cleanup();
});

beforeAll(() => {
  // Naprawia problem z Date.now w JSDOM
  if (typeof Date.now !== 'function') {
    Date.now = () => new Date().getTime();
  }
}); 