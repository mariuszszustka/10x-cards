import { expect, afterEach, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

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