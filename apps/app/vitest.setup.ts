import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { TextEncoder as NodeTextEncoder, TextDecoder as NodeTextDecoder } from 'util';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock window.ResizeObserver
class MockResizeObserver {
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }
  private callback: ResizeObserverCallback;
  observe = vi.fn((target: Element) => {
    requestAnimationFrame(() => {
      this.callback([{ target, contentRect: target.getBoundingClientRect() } as ResizeObserverEntry], this as ResizeObserver);
    });
  });
  unobserve = vi.fn();
  disconnect = vi.fn();
}
window.ResizeObserver = MockResizeObserver as any;

// Mock window.IntersectionObserver
window.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Add TextEncoder/TextDecoder to global
global.TextEncoder = NodeTextEncoder;
// @ts-ignore - the types are not exactly compatible but the implementation works
global.TextDecoder = NodeTextDecoder;

// Mock app environment
vi.mock('@/lib/env', () => ({
  app: {
    enableWinners: true,
  },
}));
