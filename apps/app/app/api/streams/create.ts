"use server";

import { createServerClient } from "@repo/supabase";
import { z } from "zod";
import { Livepeer } from "livepeer";
import { newId } from "@/lib/generate-id";
import { livepeer } from "@/lib/env";

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
    pipeline_params: validationResult.data.pipeline_params,
    output_playback_id: livepeerStream?.playbackId,
    output_stream_url: `${livepeer.rtmpUrl}${livepeerStream?.streamKey}`,
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
  const livepeerClient = new Livepeer({
    serverURL: livepeer.apiUrl,
    apiKey: livepeer.apiKey,
  });

  const { stream } = await livepeerClient.stream.create({
    name: name,
  });

  return stream;
};
