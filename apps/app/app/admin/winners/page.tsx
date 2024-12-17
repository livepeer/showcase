import { Suspense } from "react";
import { notFound } from "next/navigation";
import { createAdminServerClient } from "@repo/supabase/admin";
import { WinnerList } from "../../../components/welcome/dailychallenge";
import { WinnerUpdateForm } from "./winner-update-form";
import { app } from '../../../lib/env';

interface Challenge {
  id: string;
  prompt: string;
  start_date: string;
  end_date: string;
  created_at: string;
}

export default async function AdminWinnersPage() {
  if (!app.enableWinners) {
    notFound();
  }

  const supabase = await createAdminServerClient();

  // Fetch latest challenge
  const { data: challenges } = await supabase
    .from("daily_challenges")
    .select("*")
    .order("start_date", { ascending: false })
    .limit(1);

  // Fetch recent winners
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
    .order('challenge_date', { ascending: false })
    .limit(10);

  const latestChallenge = challenges?.[0] as Challenge | undefined;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Update Daily Winners</h1>
      <div className="mb-8">
        {latestChallenge ? (
          <>
            <p className="text-muted-foreground mb-4">
              Current Challenge: {latestChallenge.prompt}
            </p>
            <WinnerUpdateForm challenge={latestChallenge} />
          </>
        ) : (
          <p className="text-muted-foreground">No active challenge found.</p>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Winners</h2>
        <Suspense fallback={<div>Loading winners preview...</div>}>
          <WinnerList winners={winners || []} />
        </Suspense>
      </div>
    </div>
  );
}
