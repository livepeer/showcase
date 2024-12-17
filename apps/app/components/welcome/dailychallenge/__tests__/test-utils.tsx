import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { ThemeProvider } from 'next-themes';
import { ToastProvider } from '@repo/design-system/components/ui/toast';
import { Toaster } from '@repo/design-system/components/ui/toaster';
import { vi } from 'vitest';

// Mock Next.js router and navigation
const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  refresh: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  prefetch: vi.fn(),
  pathname: '/',
};

const mockSearchParams = new URLSearchParams();
mockSearchParams.set = vi.fn().mockImplementation(function (this: URLSearchParams, key: string, value: string) {
  URLSearchParams.prototype.set.call(this, key, value);
  return this;
});
mockSearchParams.get = vi.fn().mockImplementation(function (this: URLSearchParams, key: string) {
  return URLSearchParams.prototype.get.call(this, key);
});

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  useSearchParams: () => mockSearchParams,
  usePathname: () => '/',
  useParams: () => ({}),
}));

// Mock next-themes
vi.mock('next-themes', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useTheme: () => ({
    theme: 'light',
    setTheme: vi.fn(),
    themes: ['light', 'dark'],
    systemTheme: 'light',
  }),
}));

// Mock DateRangePicker component
vi.mock('@repo/design-system/components/ui/date-range-picker', () => ({
  DateRangePicker: ({ onDateRangeChange, 'aria-label': ariaLabel }: any) => (
    <button
      onClick={() => {
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        onDateRangeChange(today, tomorrow);
      }}
      aria-label={ariaLabel}
    >
      Select date range
    </button>
  ),
}));

// Create a mock toast context
const mockToast = vi.fn();
const mockDismiss = vi.fn();
const mockToasts: any[] = [];

// Mock useToast hook
vi.mock('@repo/design-system/hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
    toasts: mockToasts,
    dismiss: mockDismiss,
  }),
}));

// Mock Toaster component to avoid actual toast rendering
vi.mock('@repo/design-system/components/ui/toaster', () => ({
  Toaster: () => null,
}));

// Mock @livepeer/react Player component
vi.mock('@livepeer/react', () => ({
  Player: ({ onError, onPlay, playbackId, title, ...props }: any) => {
    React.useEffect(() => {
      onPlay?.();
      return () => {};
    }, [onPlay]);

    return (
      <div data-testid="video-player">
        <video data-playback-id={playbackId} title={title} {...props} />
      </div>
    );
  },
}));

// Mock WinnerCard component
vi.mock('../WinnerCard', () => ({
  WinnerCard: ({ winner }: any) => (
    <div data-testid="winner-card">
      <div>{winner.user_full_name}</div>
      <div>Rank #{winner.rank}</div>
      <div>{winner.pipeline_name}</div>
    </div>
  ),
}));

// Mock useWinnerFeature hook with a default enabled state
const mockUseWinnerFeature = vi.fn(() => ({ enabled: true }));
vi.mock('@/hooks/useWinnerFeature', () => ({
  useWinnerFeature: () => mockUseWinnerFeature()
}));

// Export for test manipulation
export { mockUseWinnerFeature };

function render(ui: React.ReactElement, { ...options } = {}) {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <ToastProvider>
        {children}
        <Toaster />
      </ToastProvider>
    </ThemeProvider>
  );

  return rtlRender(ui, { wrapper: Wrapper, ...options });
}

export * from '@testing-library/react';
export { render };
