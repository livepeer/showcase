import { createServerClient as createServerClientSB, createBrowserClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabase } from "./env";

export async function createServerClient() {
  const cookieStore = await cookies();

  return createServerClientSB(supabase.url, supabase.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {}
      },
    },
  });
}

export async function createAdminServerClient() {
  const cookieStore = await cookies();

  return createServerClientSB(supabase.url, supabase.serviceRoleKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {}
      },
    },
  });
}

export function createClient() {
  return createBrowserClient(supabase.url, supabase.anonKey);
}
