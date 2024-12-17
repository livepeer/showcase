"use server"

import { createServerClient } from "@repo/supabase";

export async function fetchPipelines(query: string) {
  const supabase = await createServerClient();
  try {
    const { data, error } = await supabase
      .from("pipelines")
      .select("*")
      .ilike("name", `%${query}%`);

    if (error) {
      console.error("Error fetching pipelines:", error);
      return [];
    }

    return data;
  } catch (error) {
    console.error("Unexpected error fetching pipelines:", error);
    return [];
  }
}
