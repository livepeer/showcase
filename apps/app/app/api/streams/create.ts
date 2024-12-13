"use server";

import { createServerClient } from "@repo/supabase";
import { z } from "zod";
import { Livepeer } from "livepeer";
import { newId } from "@/lib/generate-id";
import { getRtmpUrl } from "@/lib/url-helpers";

const streamSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  author: z.string(),
  pipeline_id: z.string().optional(),
  pipeline: z.object({
    id: z.string()
  }).optional(),
  pipeline_params: z.record(z.any()).optional().default({}),
  output_playback_id: z.string().optional(),
  output_stream_url: z.string().optional(),
  stream_key: z.string().optional()
}).refine(data => data.pipeline_id || data.pipeline, {
  message: "Either pipeline_id or a nested pipeline object with an id must be provided",
  path: ["pipeline_id", "pipeline.id"]
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

  if (!validationResult) {
    return { error: "No stream provided", data: null };
  }

  const streamData = {
    ...validationResult.data
  };

  const isUpdate = !!streamData?.id;
  const streamId = streamData?.id || newId("stream");

  //make sure we can connect to livepeer before we try to create a stream
  let livepeerStream;
  if (!isUpdate) {
    const result = await createLivepeerStream(streamData?.name);
    if (result.error) {
      console.error("Error creating livepeer stream. Perhaps the Livepeer Studio API Key is not configured?", result.error);
    }else{
      livepeerStream = result.stream;
    }
  }

  // upsert the `streams` table
  const streamKey = streamData?.stream_key || newId("stream_key");
  const streamPayload = {
    id: streamId,
    name: streamData.name,
    output_playback_id: streamData.output_playback_id || livepeerStream?.playbackId || null,
    output_stream_url: streamData.output_stream_url??(livepeerStream?.streamKey ? getRtmpUrl(livepeerStream.streamKey) : null),
    stream_key: streamKey,
    pipeline_params: streamData.pipeline_params,
    pipeline_id: streamData.pipeline_id || streamData.pipeline?.id,
    author: streamData.author,
    created_at: new Date(),
  };

  const { data: upsertedStream, error: streamError } = await supabase
    .from('streams')
    .upsert([streamPayload])
    .select()
    .single();

  if (streamError) {
    console.error("Error upserting stream:", streamError);
    return { data: null, error: streamError?.message };
  }

  return { data: upsertedStream, error: null };
}

export const createLivepeerStream = async (name: string) => {
  try{
    
    const livepeer = new Livepeer({
      serverURL: "https://livepeer.monster/api",
      apiKey: process.env.NEXT_PUBLIC_LIVEPEER_STUDIO_API_KEY,
    });

    const { stream, error } = await livepeer.stream.create({
      name: name,
    });

    return {stream, error};
  }catch(e: any){
    console.error("Error creating livepeer stream:", e);
    return {stream: null, error: e.message};
  }
};
