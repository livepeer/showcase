import { createBrowserClient } from "@supabase/ssr";
import { supabase } from "../../apps/app/lib/env";

export default function createClient() {
  return createBrowserClient(supabase.url, supabase.anonKey);
}
