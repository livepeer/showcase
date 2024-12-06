import { NextResponse, NextRequest } from "next/server";
import { compareSync } from "bcrypt-edge";
import { createAdminServerClient } from "@repo/supabase";
import crypto from 'crypto';

function getHashedId(ip: string, userAgent: string) {
  const stringToHash = JSON.stringify({ ip, userAgent });
  return crypto.createHash('md5').update(stringToHash).digest('hex');
}
export const config = {
  matcher: "/api/:path*",
};

export async function middleware(request: NextRequest) {
  const apiKey = request.headers.get("x-api-key");
  const userAgent = request.headers.get("user-agent") || "";
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';
  
  const supabase = await createAdminServerClient();
  let userId = null;

  if (apiKey) {
    const { data: apiKeyRecord } = await supabase
      .from("api_keys")
      .select("user_id, api_key")
      .eq("is_active", true);

    if (apiKeyRecord && apiKeyRecord.length > 0) {
      for (const keyRecord of apiKeyRecord) {
        const isValid = compareSync(apiKey, keyRecord.api_key);
        if (isValid) {
          userId = keyRecord.user_id;
          break;
        }
      }
    }
  }
  
  const finalUserId = userId || getHashedId(ip, userAgent);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-user-id", finalUserId);

  // For mixpanel routes
  if (request.nextUrl.pathname.includes("/api/mixpanel")) {
    console.log('Setting User ID for mixpanel:', finalUserId);
    return NextResponse.next({
      request: { headers: requestHeaders }
    });
  }

  // For webhook routes
  if (request.nextUrl.pathname.includes("/api/streams/webhook")) {
    return NextResponse.next();
  }

  // For all other API routes
  if (!apiKey) {
    return NextResponse.json({ message: "API key is missing" }, { status: 401 });
  }

  if (!userId) {
    return NextResponse.json({ message: "Invalid API key" }, { status: 403 });
  }

  return NextResponse.next({
    request: { headers: requestHeaders }
  });
}
