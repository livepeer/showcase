import { createServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { app } from "@/lib/env";

export async function GET(request: Request) {
  // Check feature flag first
  if (!app.enableWinners) {
    return NextResponse.json(
      { error: "Winners feature is disabled" },
      { status: 404 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const start = searchParams.get("start");
    const end = searchParams.get("end");
    const pipeline = searchParams.get("pipeline");

    if (!start || !end) {
      return NextResponse.json(
        { error: "Missing date parameters" },
        { status: 400 }
      );
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(start) || !dateRegex.test(end)) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    const supabase = await createServerClient();
    if (!supabase) {
      console.error('Failed to initialize Supabase client');
      return NextResponse.json(
        { error: "Failed to connect to database" },
        { status: 500 }
      );
    }

    let query = supabase
      .from("challenge_winners")
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
      .order('rank', { ascending: true })
      .gte("challenge_date", start)
      .lte("challenge_date", end);

    if (pipeline) {
      query = query.eq("pipeline_name", pipeline);
    }

    const { data: winners, error } = await query;

    if (error) {
      console.error("Error fetching winners history:", error);
      return NextResponse.json(
        { error: "Failed to fetch winners" },
        { status: 500 }
      );
    }

    // Return empty object if no winners found
    if (!winners || winners.length === 0) {
      return NextResponse.json({ winners: {} }, { status: 200 });
    }

    // Group winners by date
    const groupedWinners = winners.reduce((acc, winner) => {
      const date = winner.challenge_date.split("T")[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(winner);
      return acc;
    }, {} as Record<string, typeof winners>);

    return NextResponse.json({ winners: groupedWinners }, { status: 200 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Failed to fetch winners" },
      { status: 500 }
    );
  }
}
