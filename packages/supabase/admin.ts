import { createServerClient as createServerClientSB } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabase } from "../../apps/app/lib/env";

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
