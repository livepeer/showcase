"use server";

import { createServerClient } from "@repo/supabase";
import { z } from "zod";
import { Livepeer } from "livepeer";
import { Stream } from "stream";
import crypto from "crypto";
import { newId } from "@/lib/generate-id";

const streamSchema = z.object({
  pipeline_id: z.string(),
  pipeline_params: z.record(z.any()).optional().default({}),
});

export async function createStream(body: any, userId: string) {
  const supabase = await createServerClient();

  console.log("Received body:", body); // Debug log

  const validationResult = streamSchema.safeParse({
    ...body,
    author: userId,
  });
  if (!validationResult.success) {
    throw new z.ZodError(validationResult.error.errors);
  }

  const streamId = newId("stream");

  const livepeerStream = await createLivepeerStream(streamId);

  const streamData = {
    ...validationResult.data,
    id: streamId,
    stream_key: newId("stream_key"),
    pipeline_params: {
      prompt: "animated",
    },
    output_playback_id: livepeerStream?.playbackId,
    output_stream_url: `rtmp://ai.livepeer.monster/live/${livepeerStream?.streamKey}`,
  };

  console.log("Stream data:", streamData); // Debug log
  const { data, error } = await supabase
    .from("streams")
    .insert(streamData)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

const createLivepeerStream = async (name: string) => {
  const livepeer = new Livepeer({
    serverURL: "https://livepeer.monster/api",
    apiKey: process.env.NEXT_PUBLIC_LIVEPEER_STUDIO_API_KEY,
  });

  const { stream } = await livepeer.stream.create({
    name: name,
  });

  return stream;
};
