import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from '../route';
import { createServerClient } from '@/lib/supabase/server';
import { validateWinnerData } from '@/components/welcome/dailychallenge/utils';

vi.mock('@/lib/supabase/server', () => ({
  createServerClient: vi.fn(),
}));

vi.mock('@/components/welcome/dailychallenge/utils', () => ({
  validateWinnerData: vi.fn(),
}));

describe('Winners API Routes', () => {
  const mockWinners = [
    {
      id: 1,
      rank: 1,
      user_full_name: 'John Doe',
      playback_id: 'abc123',
      pipeline_name: 'test-pipeline',
      prompt_used: 'test prompt',
      description: 'test description',
      challenge_date: new Date().toISOString(),
    },
  ];

  let mockSupabase: any;
  let mockChain: any;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('NEXT_PUBLIC_ENABLE_WINNERS', 'true');

    mockChain = {
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      range: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      lte: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockReturnThis(),
    };

    mockChain.range.mockResolvedValue({
      data: mockWinners,
      error: null,
      count: 1,
    });

    mockChain.single.mockResolvedValue({
      data: null,
      error: null,
    });

    mockSupabase = {
      from: vi.fn(() => mockChain),
    };

    vi.mocked(createServerClient).mockResolvedValue(mockSupabase);
  });

  describe('GET /api/winners', () => {
    it('returns winners with pagination', async () => {
      const response = await GET(new Request('http://localhost:3000/api/winners'));
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        winners: mockWinners,
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      });
    });

    it('handles database errors', async () => {
      mockChain.range.mockResolvedValueOnce({
        data: null,
        error: new Error('Database error'),
      });

      const response = await GET(new Request('http://localhost:3000/api/winners'));
      expect(response.status).toBe(500);
    });

    it('returns 404 when feature is disabled', async () => {
      vi.stubEnv('NEXT_PUBLIC_ENABLE_WINNERS', 'false');
      const response = await GET(new Request('http://localhost:3000/api/winners'));
      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.error).toBe('Winners feature is disabled');
    });
  });

  describe('POST /api/winners', () => {
    it('creates a new winner entry', async () => {
      vi.stubEnv('NEXT_PUBLIC_ENABLE_WINNERS', 'true');

      const winnerData = {
        user_full_name: 'John Doe',
        playback_id: 'abc123',
        pipeline_name: 'test-pipeline',
        prompt_used: 'test prompt',
        description: 'test description',
        challenge_date: new Date().toISOString(),
      };

      vi.mocked(validateWinnerData).mockResolvedValue({
        isValid: true,
        errors: [],
      });

      mockChain.insert.mockResolvedValueOnce({
        data: winnerData,
        error: null,
      });

      const response = await POST(
        new Request('http://localhost:3000/api/winners', {
          method: 'POST',
          body: JSON.stringify(winnerData),
        })
      );

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data).toEqual({ success: true });
    });

    it('validates required fields', async () => {
      vi.mocked(validateWinnerData).mockResolvedValue({
        isValid: false,
        errors: [{ field: 'user_full_name', message: 'Missing required fields' }],
      });

      const response = await POST(
        new Request('http://localhost:3000/api/winners', {
          method: 'POST',
          body: JSON.stringify({}),
        })
      );

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Missing required fields');
    });

    it('returns 404 when feature is disabled', async () => {
      vi.stubEnv('NEXT_PUBLIC_ENABLE_WINNERS', 'false');
      const response = await POST(
        new Request('http://localhost:3000/api/winners', {
          method: 'POST',
          body: JSON.stringify(mockWinners[0]),
        })
      );
      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.error).toBe('Winners feature is disabled');
    });
  });
});
