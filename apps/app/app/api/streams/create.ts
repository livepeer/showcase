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

  const livepeerStream = await createLivepeerStream();

  const streamData = {
    ...validationResult.data,
    id: newId("stream"),
    stream_key: newId("stream_key"),
    pipeline_params: validationResult.data.pipeline_params,
    output_playback_id: livepeerStream?.playbackId,
    output_stream_url: `${process.env.LIVEPEER_STUDIO_RTMP_URL}/${livepeerStream?.streamKey}`,
  };

  const { data, error } = await supabase
    .from("streams")
    .insert(streamData)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

const createLivepeerStream = async () => {
  const livepeer = new Livepeer({
    apiKey: process.env.LIVEPEER_STUDIO_API_KEY,
  });

  const { stream } = await livepeer.stream.create({
    name: "test",
  });

  return stream;
};
