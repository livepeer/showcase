import React from 'react';
import { DateRangePicker } from '@repo/design-system/components/ui/date-range-picker';
import { WinnerCard } from './WinnerCard';
import type { Winner } from './types';
import { useWinnerFeature } from '@/hooks/useWinnerFeature';

interface WinnerHistoryProps {
  initialWinners: Winner[];
  isLoading?: boolean;
  error?: string | null;
}

export function WinnerHistory({ initialWinners, isLoading: initialLoading, error: initialError }: WinnerHistoryProps) {
  const { enabled } = useWinnerFeature();

  if (!enabled) {
    return null;
  }

  const [winners, setWinners] = React.useState<Winner[]>(initialWinners);
  const [isLoading, setIsLoading] = React.useState(initialLoading || false);
  const [error, setError] = React.useState<string | null>(initialError || null);

  const handleDateRangeChange = async (startDate: Date, endDate: Date) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        start: startDate.toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0],
      });

      const response = await fetch(`/api/winners/history?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch winners');
      }

      // Handle empty results (not an error condition)
      if (!data.winners || Object.keys(data.winners).length === 0) {
        setWinners([]);
        return;
      }

      // Type assertion for data.winners
      const winnersData = data.winners as Record<string, Winner[]>;
      const allWinners = Object.values(winnersData).flat();
      setWinners(allWinners);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load winners');
      console.error('Error fetching winners:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div
        className="text-red-500 p-4 rounded-md bg-red-50"
        data-testid="error-message"
        role="alert"
        aria-live="polite"
      >
        {error}
      </div>
    );
  }

  if (isLoading) {
    return <div data-testid="winners-loading">Loading winners...</div>;
  }

  if (winners.length === 0) {
    return <div data-testid="no-winners">No winners found for the selected date range</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Daily Challenge Winners</h2>
        <DateRangePicker
          onDateRangeChange={handleDateRangeChange}
          aria-label="Select date range"
          className="ml-4"
        />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {winners.map((winner) => (
          <WinnerCard key={winner.id} winner={winner} />
        ))}
      </div>
    </div>
  );
}
