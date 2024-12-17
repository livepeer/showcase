import { createServerClient as createServerClientSB } from "@supabase/ssr";
import { cookies } from "next/headers";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

export async function createServerClient() {
  const cookieStore = cookies();

  return createServerClientSB(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: Partial<ResponseCookie>) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Handle cookie errors silently in middleware
          }
        },
        remove(name: string, options: Partial<ResponseCookie>) {
          try {
            cookieStore.set({ name, value: "", ...options, maxAge: 0 });
          } catch (error) {
            // Handle cookie errors silently in middleware
          }
        },
      },
    }
  );
}
