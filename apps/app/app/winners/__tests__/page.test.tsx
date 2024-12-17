import { describe, it, expect, vi } from 'vitest';
import { notFound } from 'next/navigation';
import WinnersPage from '../page';
import { app } from '../../../lib/env';
import { createServerClient } from '@repo/supabase/server';
import { SupabaseClient } from '@supabase/supabase-js';

vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
}));

vi.mock('@repo/supabase/server', () => ({
  createServerClient: vi.fn(),
}));

vi.mock('../../../lib/env', () => ({
  app: {
    enableWinners: true,
  },
}));

describe('WinnersPage', () => {
  it('calls notFound when feature flag is disabled', async () => {
    vi.mocked(app).enableWinners = false;
    await WinnersPage({ searchParams: {} });
    expect(notFound).toHaveBeenCalled();
  });

  it('renders winners page when feature flag is enabled', async () => {
    vi.mocked(app).enableWinners = true;
    const mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      data: [],
    } as unknown as SupabaseClient;

    vi.mocked(createServerClient).mockResolvedValue(mockSupabase);

    const result = await WinnersPage({ searchParams: {} });
    expect(result).toBeDefined();
    expect(notFound).not.toHaveBeenCalled();
  });
});
