import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerClient } from "@repo/supabase";

const ERROR_MESSAGES = {
  UNAUTHORIZED: "Authentication required",
  INVALID_INPUT: "Invalid pipeline configuration",
  INTERNAL_ERROR: "An unexpected error occurred",
  NOT_FOUND: "Stream not found",
} as const;

export async function POST(request: Request) {
  const supabase = await createServerClient();

  try {
    // const userId = request.headers.get("x-user-id");
    // if (!userId) {
    //   return createErrorResponse(401, ERROR_MESSAGES.UNAUTHORIZED);
    // }

    const body = await request.json().catch(() => null);

    console.log("body", body);
    if (!body) {
      return createErrorResponse(400, ERROR_MESSAGES.INVALID_INPUT);
    }

    const stream_key = body.stream_key;

    const { data, error } = await supabase
      .from("streams")
      .select("*, pipeline_id(key,id)")
      .eq("stream_key", stream_key)
      .single();

    if (!data) {
      return createErrorResponse(404, ERROR_MESSAGES.NOT_FOUND);
    }

    const response = {
      rtmp_output_url: data?.output_stream_url,
      pipeline: data?.pipeline_id?.key,
      pipeline_id: data?.pipeline_id?.id,
      pipeline_parameters: data?.pipeline_params,
      stream_id: data?.id
    };

    console.log("sending response", response);

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createErrorResponse(400, error.issues);
    }
    const message =
      error instanceof Error ? error.message : ERROR_MESSAGES.INTERNAL_ERROR;
    return createErrorResponse(500, message);
  }
}

function createErrorResponse(status: number, message: unknown) {
  return NextResponse.json({ success: false, error: message }, { status });
}
