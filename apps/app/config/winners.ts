export interface Winner {
  title: string;
  description: string;
  playbackId: string;
  winnerName: string;
  rank: number;
  discordHandle: string;
  winningDate: string; // ISO date string YYYY-MM-DD
}

export const winners: Winner[] = [
  {
    title: "AI Portrait Challenge",
    description: "Best use of Live Portrait model",
    playbackId: "c99filnga205mzqh",
    winnerName: "John Doe",
    rank: 1,
    discordHandle: "@johndoe",
    winningDate: "2024-01-18"
  },
  {
    title: "Stream Diffusion Art",
    description: "Most creative Stream Diffusion output",
    playbackId: "c99filnga205mzqh",
    winnerName: "Jane Smith",
    rank: 2,
    discordHandle: "@janesmith",
    winningDate: "2024-01-18"
  },
  {
    title: "Depth Analysis",
    description: "Best depth map generation",
    playbackId: "c99filnga205mzqh",
    winnerName: "Bob Wilson",
    rank: 3,
    discordHandle: "@bobwilson",
    winningDate: "2024-01-18"
  }
];

export function getWinnersByDate(date: Date): Winner[] {
  const dateStr = date.toISOString().split('T')[0];
  return winners
    .filter(winner => winner.winningDate === dateStr)
    .sort((a, b) => a.rank - b.rank);
}

export function getYesterdaysWinners(): Winner[] {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return getWinnersByDate(yesterday);
}
