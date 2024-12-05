"use server";

import { createServerClient } from "@repo/supabase";

export async function getAllPipelines(userId: string) {
  const supabase = await createServerClient();

  const { data, error } = await supabase.from("pipelines").select("*");

  if (error) throw new Error(error.message);

  return data;
}

export async function getPipeline(pipelineId: string) {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("pipelines")
    .select("*")
    .eq("id", pipelineId)
    .single();
  if (error) throw new Error(error.message);

  return data;
}
