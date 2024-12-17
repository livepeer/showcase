import React from 'react';
import { notFound } from 'next/navigation';
import { createServerClient } from '@repo/supabase/server';
import { DateRangePicker } from '@repo/design-system/components/ui/date-range-picker';
import { WinnerList } from '../../components/welcome/dailychallenge';
import { Card } from '@repo/design-system/components/ui/card';
import { app } from '@/lib/env';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: {
    start?: string;
    end?: string;
  };
}

export default async function WinnersPage({ searchParams }: PageProps) {
  if (!app.enableWinners) {
    notFound();
  }

  const supabase = await createServerClient();

  const startDate = searchParams.start ? new Date(searchParams.start) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default to last 30 days
  const endDate = searchParams.end ? new Date(searchParams.end) : new Date();

  const { data: winners } = await supabase
    .from('challenge_winners')
    .select(`
      id,
      rank,
      user_full_name,
      user_github,
      user_discord,
      playback_id,
      pipeline_name,
      prompt_used,
      description,
      challenge_date
    `)
    .gte('challenge_date', startDate.toISOString())
    .lte('challenge_date', endDate.toISOString())
    .order('challenge_date', { ascending: false });

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Daily Challenge Winners</h1>
        <DateRangePicker />
      </div>

      {winners && winners.length > 0 ? (
        <WinnerList winners={winners} />
      ) : (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No winners found for the selected date range.</p>
        </Card>
      )}
    </div>
  );
}
