import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '../route';
import { createServerClient } from '@/lib/supabase/server';
import { SupabaseClient } from '@supabase/supabase-js';
import { app } from '@/lib/env';

// Mock env and Supabase client
vi.mock('@/lib/env', () => ({
  app: {
    enableWinners: true,
  },
}));

vi.mock('@/lib/supabase/server', () => ({
  createServerClient: vi.fn(),
}));

describe('Winners History API Route', () => {
  const mockWinners = [
    {
      id: 1,
      rank: 1,
      user_full_name: 'John Doe',
      user_github: 'johndoe',
      user_discord: 'johndoe#1234',
      playback_id: '1234567890123456',
      pipeline_name: 'Test Pipeline',
      prompt_used: 'Test prompt',
      description: 'Test description',
      challenge_date: '2024-01-01T00:00:00Z',
    },
  ];

  let mockSupabase: {
    from: ReturnType<typeof vi.fn>;
    select: ReturnType<typeof vi.fn>;
    order: ReturnType<typeof vi.fn>;
    gte: ReturnType<typeof vi.fn>;
    lte: ReturnType<typeof vi.fn>;
    eq: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockSupabase = {
      from: vi.fn(() => mockSupabase),
      select: vi.fn(() => mockSupabase),
      order: vi.fn(() => mockSupabase),
      gte: vi.fn(() => mockSupabase),
      lte: vi.fn(() => ({
        data: mockWinners,
        error: null,
      })),
      eq: vi.fn(() => mockSupabase),
    };

    // Reset all mocks
    vi.clearAllMocks();

    // Setup successful Supabase client mock
    vi.mocked(createServerClient).mockResolvedValue(mockSupabase as unknown as SupabaseClient);
  });

  describe('Feature Flag Tests', () => {
    it('returns 404 when feature flag is disabled', async () => {
      vi.mocked(app).enableWinners = false;

      const url = new URL('http://localhost:3000/api/winners/history');
      url.searchParams.set('start', '2024-01-01');
      url.searchParams.set('end', '2024-01-02');

      const response = await GET(new Request(url));
      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.error).toBe('Winners feature is disabled');
    });

    it('processes request when feature flag is enabled', async () => {
      vi.mocked(app).enableWinners = true;

      const url = new URL('http://localhost:3000/api/winners/history');
      url.searchParams.set('start', '2024-01-01');
      url.searchParams.set('end', '2024-01-02');

      const response = await GET(new Request(url));
      expect(response.status).toBe(200);
    });
  });

  it('returns winners within date range', async () => {
    const url = new URL('http://localhost:3000/api/winners/history');
    url.searchParams.set('start', '2024-01-01');
    url.searchParams.set('end', '2024-01-02');

    const response = await GET(new Request(url));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      winners: {
        '2024-01-01': mockWinners,
      },
    });

    expect(mockSupabase.from).toHaveBeenCalledWith('challenge_winners');
    expect(mockSupabase.select).toHaveBeenCalled();
    expect(mockSupabase.order).toHaveBeenCalledWith('rank', { ascending: true });
    expect(mockSupabase.gte).toHaveBeenCalledWith('challenge_date', '2024-01-01');
    expect(mockSupabase.lte).toHaveBeenCalledWith('challenge_date', '2024-01-02');
  });

  it('handles missing date parameters', async () => {
    const response = await GET(
      new Request('http://localhost:3000/api/winners/history')
    );

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Missing date parameters');
  });

  it('handles invalid date format', async () => {
    const url = new URL('http://localhost:3000/api/winners/history');
    url.searchParams.set('start', 'invalid');
    url.searchParams.set('end', 'invalid');

    const response = await GET(new Request(url));
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Invalid date format');
  });

  it('handles database errors', async () => {
    mockSupabase.lte.mockResolvedValue({
      data: null,
      error: { message: 'Database error', code: 'PGERROR' },
    });

    const url = new URL('http://localhost:3000/api/winners/history');
    url.searchParams.set('start', '2024-01-01');
    url.searchParams.set('end', '2024-01-02');

    const response = await GET(new Request(url));
    const data = await response.json();
    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to fetch winners');
  });

  it('returns empty winners object when no data found', async () => {
    mockSupabase.lte.mockResolvedValue({
      data: [],
      error: null,
    });

    const url = new URL('http://localhost:3000/api/winners/history');
    url.searchParams.set('start', '2024-01-01');
    url.searchParams.set('end', '2024-01-02');

    const response = await GET(new Request(url));
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data).toEqual({ winners: {} });
  });
});
