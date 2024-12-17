import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, mockUseWinnerFeature } from './test-utils';
import userEvent from '@testing-library/user-event';
import { WinnerHistory } from '../WinnerHistory';
import type { Winner } from '../types';

const mockWinners: Winner[] = [
  {
    id: 1,
    user_full_name: 'John Doe',
    user_github: 'johndoe',
    user_discord: '123456789012345678',
    playback_id: 'abcd1234efgh5678',
    pipeline_name: 'Test Pipeline',
    prompt_used: 'Test prompt',
    description: 'Test description',
    rank: 1,
    challenge_date: '2024-01-17',
  },
  {
    id: 2,
    user_full_name: 'Jane Smith',
    playback_id: 'ijkl9012mnop3456',
    pipeline_name: 'Another Pipeline',
    prompt_used: 'Another prompt',
    description: 'Another description',
    rank: 2,
    challenge_date: '2024-01-16',
  },
];

describe('WinnerHistory', () => {
  beforeEach(() => {
    vi.spyOn(global, 'fetch').mockImplementation(async (url) => {
      if (url.toString().includes('/api/winners/history')) {
        return {
          ok: true,
          json: async () => ({
            winners: {
              '2024-01-16': [mockWinners[1]],
              '2024-01-17': [mockWinners[0]],
            },
          }),
        } as Response;
      }
      throw new Error(`Unhandled fetch request: ${url}`);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Feature Flag Tests', () => {
    it('does not render when feature flag is disabled', async () => {
      mockUseWinnerFeature.mockReturnValue({ enabled: false });
      const { container } = render(<WinnerHistory initialWinners={mockWinners} />);
      expect(container.firstChild).toBeNull();
    });

    it('renders when feature flag is enabled', async () => {
      mockUseWinnerFeature.mockReturnValue({ enabled: true });
      render(<WinnerHistory initialWinners={mockWinners} />);
      expect(screen.getByTestId('winner-card')).toBeInTheDocument();
    });
  });

  it('renders winners list with date filter', async () => {
    render(<WinnerHistory initialWinners={mockWinners} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByLabelText(/Select date range/i)).toBeInTheDocument();
  });

  it('filters winners by date range', async () => {
    render(<WinnerHistory initialWinners={mockWinners} />);
    const user = userEvent.setup();

    // Open date picker
    await user.click(screen.getByLabelText(/Select date range/i));

    // Select date range
    await user.click(screen.getByLabelText('Monday, January 16th, 2024'));
    await user.click(screen.getByLabelText('Tuesday, January 17th, 2024'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/winners/history')
      );
    });

    // Verify that the URL includes the correct date parameters
    const fetchCall = vi.mocked(global.fetch).mock.calls[0][0] as string;
    expect(fetchCall).toMatch(/startDate=.+&endDate=.+/);
  });

  it('handles API errors gracefully', async () => {
    vi.spyOn(global, 'fetch').mockImplementationOnce(async () => {
      throw new Error('API Error');
    });

    render(<WinnerHistory initialWinners={mockWinners} />);
    const user = userEvent.setup();

    await user.click(screen.getByLabelText(/Select date range/i));
    await user.click(screen.getByLabelText('Monday, January 16th, 2024'));
    await user.click(screen.getByLabelText('Tuesday, January 17th, 2024'));

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
      expect(screen.getByText(/Failed to load winners/i)).toBeInTheDocument();
    });
  });

  it('displays loading state while fetching', async () => {
    let resolvePromise: (value: Response) => void;
    const fetchPromise = new Promise<Response>((resolve) => {
      resolvePromise = resolve;
    });

    vi.spyOn(global, 'fetch').mockImplementationOnce(() => fetchPromise);

    render(<WinnerHistory initialWinners={mockWinners} />);
    const user = userEvent.setup();

    await user.click(screen.getByLabelText(/Select date range/i));
    await user.click(screen.getByLabelText('Monday, January 16th, 2024'));
    await user.click(screen.getByLabelText('Tuesday, January 17th, 2024'));

    expect(screen.getByTestId('winners-loading')).toBeInTheDocument();

    resolvePromise!({
      ok: true,
      json: async () => ({
        winners: {
          '2024-01-16': [mockWinners[1]],
          '2024-01-17': [mockWinners[0]],
        },
      }),
    } as Response);

    await waitFor(() => {
      expect(screen.queryByTestId('winners-loading')).not.toBeInTheDocument();
    });
  });

  it('displays empty state when no winners', () => {
    render(<WinnerHistory initialWinners={[]} />);
    expect(screen.getByTestId('no-winners')).toBeInTheDocument();
  });
});
