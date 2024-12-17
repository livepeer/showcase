import { describe, it, expect, vi } from 'vitest';
import { useWinnerFeature } from '../useWinnerFeature';
import { app } from '../../lib/env';

vi.mock('../../lib/env', () => ({
  app: {
    enableWinners: true,
  },
}));

describe('useWinnerFeature', () => {
  it('returns true when feature flag is enabled', () => {
    expect(useWinnerFeature()).toBe(true);
  });

  it('returns false when feature flag is disabled', () => {
    vi.mocked(app).enableWinners = false;
    expect(useWinnerFeature()).toBe(false);
  });
});
