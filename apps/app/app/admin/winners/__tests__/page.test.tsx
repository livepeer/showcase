import { describe, it, expect, vi } from 'vitest';
import { notFound } from 'next/navigation';
import AdminWinnersPage from '../page';
import { app } from '../../../../lib/env';
import { createAdminServerClient } from '@repo/supabase/admin';
import { SupabaseClient } from '@supabase/supabase-js';

vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
}));

vi.mock('@repo/supabase/admin', () => ({
  createAdminServerClient: vi.fn(),
}));

vi.mock('../../../../lib/env', () => ({
  app: {
    enableWinners: true,
  },
}));

describe('AdminWinnersPage', () => {
  it('calls notFound when feature flag is disabled', async () => {
    vi.mocked(app).enableWinners = false;
    await AdminWinnersPage();
    expect(notFound).toHaveBeenCalled();
  });

  it('renders admin page when feature flag is enabled', async () => {
    vi.mocked(app).enableWinners = true;
    const mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      data: [],
    } as unknown as SupabaseClient;

    vi.mocked(createAdminServerClient).mockResolvedValue(mockSupabase);

    const result = await AdminWinnersPage();
    expect(result).toBeDefined();
    expect(notFound).not.toHaveBeenCalled();
  });
});
