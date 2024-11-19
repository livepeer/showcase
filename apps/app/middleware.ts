import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const config = {
  matcher: "/api/:path*",
};
export async function middleware(request: NextRequest) {
  const apiKey = request.headers.get("x-api-key");

  if (!apiKey) {
    return NextResponse.json(
      { message: "API key is missing" },
      { status: 401 }
    );
  }

  const { data: apiKeyRecord, error } = await supabase
    .from("api_keys")
    .select("user_id, isActive")
    .eq("api_key", apiKey)
    .single();

  if (error || !apiKeyRecord || !apiKeyRecord.isActive) {
    return NextResponse.json(
      { message: "Invalid or inactive API key" },
      { status: 403 }
    );
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-user-id", apiKeyRecord.user_id);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
