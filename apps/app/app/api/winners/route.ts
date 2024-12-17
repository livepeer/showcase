import { createServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { validateWinnerData } from "@/components/welcome/dailychallenge/utils";

export async function GET(request: Request) {
  // Check feature flag first
  const enableWinners = process.env.NEXT_PUBLIC_ENABLE_WINNERS !== 'false';
  if (!enableWinners) {
    return NextResponse.json(
      { error: "Winners feature is disabled" },
      { status: 404 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const start = searchParams.get("start");
    const end = searchParams.get("end");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const supabase = await createServerClient();
    if (!supabase) {
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
      `, {
        count: "exact",
      });

    if (start) {
      query = query.gte("challenge_date", start);
    }
    if (end) {
      query = query.lte("challenge_date", end);
    }

    const { data: winners, error, count } = await query
      .order("challenge_date", { ascending: false })
      .order("rank", { ascending: true })
      .range((page - 1) * limit, page * limit - 1);

    if (error) {
      console.error("Error fetching winners:", error);
      return NextResponse.json(
        { error: "Failed to fetch winners" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      winners,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  // Check feature flag first
  const enableWinners = process.env.NEXT_PUBLIC_ENABLE_WINNERS !== 'false';
  if (!enableWinners) {
    return NextResponse.json(
      { error: "Winners feature is disabled" },
      { status: 404 }
    );
  }

  try {
    const data = await request.json();

    // Validate winner data
    const validation = await validateWinnerData(data);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = await createServerClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Failed to connect to database" },
        { status: 500 }
      );
    }

    // Insert winner data
    const { error } = await supabase
      .from("challenge_winners")
      .insert(data);

    if (error) {
      console.error("Error creating winner:", error);
      if (error.code === '23505') { // Unique constraint violation
        return NextResponse.json(
          { error: "Winner already exists" },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: "Failed to create winner" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
