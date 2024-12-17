import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Mock all CSS imports
vi.mock('*.css', () => ({}));
vi.mock('*.module.css', () => ({}));

// Mock Tailwind classes
vi.mock('@repo/design-system/postcss.config', () => ({}));

// Add custom matchers
expect.extend({
  toBeInTheDocument(received) {
    const pass = received !== null && received !== undefined;
    return {
      pass,
      message: () =>
        pass
          ? `Expected element not to be in the document`
          : `Expected element to be in the document`,
    };
  },
});

afterEach(() => {
  cleanup();
});
