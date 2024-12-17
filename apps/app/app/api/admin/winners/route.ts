import { createServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { z } from "zod";

const winnerSchema = z.object({
  rank: z.number().int().min(1),
  user_full_name: z.string().min(1, "Full name is required"),
  user_github: z.string().optional(),
  user_discord: z.string().optional(),
  playback_id: z.string().regex(/^[a-zA-Z0-9]{16}$/, "Invalid playback ID format"),
  pipeline_name: z.string().min(1, "Pipeline name is required"),
  prompt_used: z.string().min(1, "Prompt is required"),
  description: z.string().min(1, "Description is required"),
  challenge_date: z.string().datetime(),
});

const requestSchema = z.object({
  winners: z.array(winnerSchema),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validationResult = requestSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.errors;
      const playbackIdError = errors.find(
        error => error.path.includes('playback_id') && error.message.includes('regex')
      );

      if (playbackIdError) {
        return NextResponse.json(
          { error: "Invalid playback ID format" },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: errors[0]?.message || "Invalid request body" },
        { status: 400 }
      );
    }

    const { winners } = validationResult.data;
    const supabase = await createServerClient();

    // Insert or update winners
    const { data, error: upsertError } = await supabase
      .from("challenge_winners")
      .upsert(winners)
      .select();

    if (upsertError) {
      console.error("Error upserting winners:", upsertError);
      return NextResponse.json(
        { error: "Failed to update winners" },
        { status: upsertError.message?.includes('validation') ? 400 : 500 }
      );
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Failed to update winners" },
      { status: 500 }
    );
  }
}
