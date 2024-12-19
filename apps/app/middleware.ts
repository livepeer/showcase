import { NextResponse, NextRequest } from "next/server";
import { compareSync } from "bcrypt-edge";
import { createAdminServerClient } from "@repo/supabase";

export const config = {
  matcher: "/api/:path*",
};
const LOCAL_STORAGE_KEY = 'isVerified';

export function middleware(request: NextRequest) {
  // Don't protect the password-protect page itself
  if (request.nextUrl.pathname === '/password-protect') {
    return NextResponse.next()
  }

  // Check for verification in localStorage
  const isVerified = localStorage.getItem(LOCAL_STORAGE_KEY);

  if (!isVerified) {
    return NextResponse.redirect(new URL('/password-protect', request.url))
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-user-id", "123");

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
