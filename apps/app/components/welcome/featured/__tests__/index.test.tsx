import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ReactElement } from 'react';
import Winners from '../index';

// Mock the winners data
vi.mock('../../../../config/winners', () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  return {
    getYesterdaysWinners: () => [{
      title: "Test Winner 2",
      description: "Test Description 2",
      playbackId: "test456",
      winnerName: "Test User 2",
      rank: 1,
      discordHandle: "@test2",
      winningDate: yesterdayStr
    }]
  };
});

const renderComponent = (): void => {
  render(Winners() as ReactElement);
};

describe('Winners Component', () => {
  beforeEach(() => {
    renderComponent();
  });

  it('displays yesterday\'s winner information', async () => {
    const winnerTitle = await screen.findByText('Test Winner 2');
    const discordHandle = await screen.findByText('@test2');
    const rank = await screen.findByText('Rank #1');

    expect(winnerTitle).toBeTruthy();
    expect(discordHandle).toBeTruthy();
    expect(rank).toBeTruthy();

    const iframe = document.querySelector('iframe') as HTMLIFrameElement;
    expect(iframe).toBeTruthy();
    expect(iframe.src).toContain('test456');
  });

  it('displays winners in correct rank order', async () => {
    const rankElement = await screen.findByText('Rank #1');
    expect(rankElement).toBeTruthy();

    const otherRanks = screen.queryByText(/Rank #[2-9]/);
    expect(otherRanks).toBeNull();
  });
});
