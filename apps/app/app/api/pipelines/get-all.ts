"use server";

import { createServerClient } from "@repo/supabase";

export async function getAllPipelines(userId: string) {
  const supabase = await createServerClient();

  const { data, error } = await supabase.from("pipelines").select("*");

  if (error) throw new Error(error.message);

  return data;
}
