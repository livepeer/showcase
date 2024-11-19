"use server";

import { createServerClient } from "@repo/supabase";
import crypto from "crypto";
import { hashSync } from "bcrypt-edge";

export async function createAPIKey(
  apiKeyName: string,
  userId: string | undefined
) {
  const supabase = await createServerClient();

  if (!apiKeyName || !userId) {
    return;
  }

  const apiKey = crypto.randomBytes(32).toString("hex"); // 64-character API key

  const hashedApiKey = await hashSync(apiKey, 10);

  const { data, error } = await supabase.from("api_keys").insert({
    name: apiKeyName,
    api_key: hashedApiKey,
    user_id: userId,
  });

  if (error) {
    console.error("Error storing API key:", error);
    throw new Error("Could not store API key");
  }

  return apiKey;
}
