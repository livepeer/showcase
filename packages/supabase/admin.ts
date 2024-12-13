import { createServerClient as createServerClientSB } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createAdminServerClient() {
  const cookieStore = await cookies();

  return createServerClientSB(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
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
    }
  );
}
