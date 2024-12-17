import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from './test-utils';
import { WinnerCard } from '../WinnerCard';
import type { Winner } from '../types';

vi.mock('@livepeer/react');

describe('WinnerCard', () => {
  const mockWinner: Winner = {
    id: 1,
    user_full_name: 'John Doe',
    user_github: 'johndoe',
    user_discord: '123456789012345678',
    playback_id: 'abcd1234efgh5678',
    pipeline_name: 'Test Pipeline',
    prompt_used: 'Test prompt',
    description: 'Test description',
    rank: 1,
    challenge_date: new Date().toISOString(),
  };

  it('renders winner information correctly', () => {
    render(<WinnerCard winner={mockWinner} />);

    expect(screen.getByText(mockWinner.user_full_name)).toBeInTheDocument();
    expect(screen.getByText(`Pipeline: ${mockWinner.pipeline_name}`)).toBeInTheDocument();
    expect(screen.getByText(mockWinner.description)).toBeInTheDocument();
    expect(screen.getByText(`Rank #${mockWinner.rank}`)).toBeInTheDocument();
  });

  it('renders optional social media fields when provided', () => {
    render(<WinnerCard winner={mockWinner} />);

    const githubElement = screen.getByText(/@johndoe/i);
    const discordElement = screen.getByText(/123456789012345678/i);

    expect(githubElement).toBeInTheDocument();
    expect(discordElement).toBeInTheDocument();
  });

  it('handles missing optional fields gracefully', () => {
    const winnerWithoutOptionals = {
      ...mockWinner,
      user_github: undefined,
      user_discord: undefined,
    };

    render(<WinnerCard winner={winnerWithoutOptionals} />);

    expect(screen.queryByText('GitHub:')).not.toBeInTheDocument();
    expect(screen.queryByText('Discord:')).not.toBeInTheDocument();
  });

  it('formats challenge date correctly', () => {
    const date = new Date('2024-01-17');
    const winner = {
      ...mockWinner,
      challenge_date: date.toISOString(),
    };

    render(<WinnerCard winner={winner} />);

    expect(screen.getByText(/January 17, 2024/)).toBeInTheDocument();
  });

  it('renders social media links correctly', () => {
    render(<WinnerCard winner={mockWinner} />);

    const githubLink = screen.getByRole('link', { name: /@johndoe/i });
    expect(githubLink).toHaveAttribute('href', `https://github.com/${mockWinner.user_github}`);

    const discordText = screen.getByText(/123456789012345678/i);
    expect(discordText).toBeInTheDocument();
  });

  it('renders video player with correct lvpr.tv URL', async () => {
    render(<WinnerCard winner={mockWinner} />);

    const loadingSpinner = screen.getByTestId('video-loading');
    expect(loadingSpinner).toBeInTheDocument();

    const videoPlayer = screen.getByTestId('video-player');
    expect(videoPlayer).toHaveAttribute('src', `https://lvpr.tv/?v=${mockWinner.playback_id}`);
    expect(videoPlayer).toHaveAttribute('title', `Winner ${mockWinner.user_full_name}'s submission`);
  });

  it('truncates long description text', () => {
    const longDescription = 'A'.repeat(300);
    const winnerWithLongDesc = {
      ...mockWinner,
      description: longDescription,
    };

    render(<WinnerCard winner={winnerWithLongDesc} />);

    const description = screen.getByText(/^A+/i);
    expect(description.textContent!.length).toBeLessThan(300);
    expect(description).toHaveAttribute('title', longDescription);
  });

  it('handles invalid playback IDs gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const invalidWinner = {
      ...mockWinner,
      playback_id: 'invalid!@#$',
    };

    render(<WinnerCard winner={invalidWinner} />);

    const errorMessage = screen.getByText(/Unable to load video/i);
    expect(errorMessage).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it('displays loading state while video is initializing', async () => {
    render(<WinnerCard winner={mockWinner} />);

    const loadingSpinner = screen.getByTestId('video-loading');
    expect(loadingSpinner).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId('video-loading')).not.toBeInTheDocument();
    });
  });
});
