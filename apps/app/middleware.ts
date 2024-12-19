import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Don't protect the password-protect page itself
  if (request.nextUrl.pathname === '/password-protect') {
    return NextResponse.next()
  }

  // Check for verification in cookies/localStorage
  const isVerified = request.cookies.get('isVerified')
  
  if (!isVerified) {
    return NextResponse.redirect(new URL('/password-protect', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/:path*',
}
