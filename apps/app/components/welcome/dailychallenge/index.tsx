import React from 'react';
import { WinnerCard } from './WinnerCard';

interface WinnerListProps {
  winners: Array<{
    id: string;
    rank: number;
    user_full_name: string;
    user_github?: string;
    user_discord?: string;
    playback_id: string;
    pipeline_name: string;
    prompt_used: string;
    description: string;
    challenge_date: string;
  }>;
}

export function WinnerList({ winners }: WinnerListProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {winners.map((winner) => (
          <WinnerCard key={winner.id} winner={winner} />
        ))}
      </div>
    </div>
  );
}
