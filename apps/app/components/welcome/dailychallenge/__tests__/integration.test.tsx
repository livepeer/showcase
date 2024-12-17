import React from 'react';
import { render, screen, waitFor } from './test-utils';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { WinnerHistory } from '../WinnerHistory';
import { WinnerUpdateForm } from '../WinnerUpdateForm';

const mockWinner = {
  user_full_name: 'John Doe',
  user_github: 'johndoe',
  user_discord: 'johndoe#1234',
  playback_id: 'abc123def456ghi7',
  pipeline_name: 'Test Pipeline',
  prompt_used: 'Test Prompt',
  description: 'Test Description',
  rank: 1,
  challenge_date: new Date('2024-01-01T00:00:00Z').toISOString().split('T')[0],
};

describe('Winner Management Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('handles form submission correctly', async () => {
    const user = userEvent.setup();
    const mockOnSubmit = vi.fn();
    const mockDate = new Date('2024-01-01T00:00:00Z');

    vi.setSystemTime(mockDate);

    render(<WinnerUpdateForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByLabelText(/Full Name/i), mockWinner.user_full_name);
    await user.type(screen.getByLabelText(/GitHub Username/i), mockWinner.user_github);
    await user.type(screen.getByLabelText(/Discord ID/i), mockWinner.user_discord);
    await user.type(screen.getByLabelText(/Playback ID/i), mockWinner.playback_id);
    await user.type(screen.getByLabelText(/Pipeline Name/i), mockWinner.pipeline_name);
    await user.type(screen.getByLabelText(/Prompt/i), mockWinner.prompt_used);
    await user.type(screen.getByLabelText(/Description/i), mockWinner.description);

    // Clear and set rank field properly
    const rankInput = screen.getByLabelText(/Rank/i);
    await user.clear(rankInput);
    await user.type(rankInput, '1');

    const submitButton = screen.getByTestId('submit-winner-form');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        ...mockWinner,
        challenge_date: mockDate.toISOString().split('T')[0],
      });
    });
  });

  it('handles API errors gracefully', async () => {
    const user = userEvent.setup();
    const errorMessage = 'Failed to fetch winners';

    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: errorMessage }),
      })
    );

    render(<WinnerHistory initialWinners={[]} />);

    const dateRangeButton = screen.getByRole('button', { name: /Select date range/i });
    await user.click(dateRangeButton);

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
      expect(screen.getByTestId('error-message')).toHaveTextContent(errorMessage);
    });
  });
});
