import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../route';
import { createServerClient } from '@/lib/supabase/server';
import type { SupabaseClient } from '@supabase/supabase-js';

// Mock Supabase client
vi.mock('@/lib/supabase/server', () => ({
  createServerClient: vi.fn(),
}));

describe('Winners API Route', () => {
  let mockSupabase: any;

  beforeEach(() => {
    mockSupabase = {
      from: vi.fn(() => mockSupabase),
      upsert: vi.fn(() => mockSupabase),
      select: vi.fn(() => Promise.resolve({
        data: [{ id: 1 }],
        error: null,
      })),
    };

    vi.clearAllMocks();
    vi.mocked(createServerClient).mockResolvedValue(mockSupabase as unknown as SupabaseClient);
  });

  it('should successfully update winners', async () => {
    const req = new Request('http://localhost:3000/api/admin/winners', {
      method: 'POST',
      body: JSON.stringify({
        winners: [{
          rank: 1,
          user_full_name: 'John Doe',
          playback_id: '1234567890123456',
          pipeline_name: 'Test Pipeline',
          prompt_used: 'Test prompt',
          description: 'Test description',
          challenge_date: '2024-01-17T00:00:00Z',
        }],
      }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(mockSupabase.from).toHaveBeenCalledWith('challenge_winners');
    expect(mockSupabase.upsert).toHaveBeenCalled();
  });

  it('should handle invalid request body', async () => {
    const req = new Request('http://localhost:3000/api/admin/winners', {
      method: 'POST',
      body: JSON.stringify({
        winners: [{
          // Missing required fields
          playback_id: '1234567890123456',
        }],
      }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBeTruthy();
  });

  it('should handle database errors', async () => {
    mockSupabase.upsert.mockResolvedValue({
      error: new Error('Database error'),
    });

    const req = new Request('http://localhost:3000/api/admin/winners', {
      method: 'POST',
      body: JSON.stringify({
        winners: [{
          rank: 1,
          user_full_name: 'John Doe',
          playback_id: '1234567890123456',
          pipeline_name: 'Test Pipeline',
          prompt_used: 'Test prompt',
          description: 'Test description',
          challenge_date: '2024-01-17T00:00:00Z',
        }],
      }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to update winners');
  });

  it('should validate playback ID format', async () => {
    const req = new Request('http://localhost:3000/api/admin/winners', {
      method: 'POST',
      body: JSON.stringify({
        winners: [{
          rank: 1,
          user_full_name: 'John Doe',
          playback_id: 'invalid',
          pipeline_name: 'Test Pipeline',
          prompt_used: 'Test prompt',
          description: 'Test description',
          challenge_date: '2024-01-17T00:00:00Z',
        }],
      }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid playback ID format');
  });
});
