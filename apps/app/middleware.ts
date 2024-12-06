import { NextResponse, NextRequest } from "next/server";
import { compareSync } from "bcrypt-edge";
import { createAdminServerClient } from "@repo/supabase";

export const config = {
  matcher: "/api/:path*",
};

export async function middleware(request: NextRequest) {
  // Early return for webhook and mixpanel routes
  if (request.nextUrl.pathname.includes("/api/streams/webhook") ||
      request.nextUrl.pathname.includes("/api/mixpanel")) {
    return NextResponse.next();
  }

  // For all other API routes, require API key
  const apiKey = request.headers.get("x-api-key");
  if (!apiKey) {
    return NextResponse.json({ message: "API key is missing" }, { status: 401 });
  }

  const supabase = await createAdminServerClient();
  const { data: apiKeyRecord } = await supabase
    .from("api_keys")
    .select("user_id, api_key")
    .eq("is_active", true);

  let userId = null;
  if (apiKeyRecord && apiKeyRecord.length > 0) {
    for (const keyRecord of apiKeyRecord) {
      if (compareSync(apiKey, keyRecord.api_key)) {
        userId = keyRecord.user_id;
        break;
      }
    }
  }

  if (!userId) {
    return NextResponse.json({ message: "Invalid API key" }, { status: 403 });
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-user-id", userId);
  return NextResponse.next({
    request: { headers: requestHeaders }
  });
}
