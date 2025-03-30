import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('twitter_access_token');
  const accessSecret = request.cookies.get('twitter_access_secret');

  if (!accessToken || !accessSecret) {
    console.error("accessTokenかaccessSecretがありません");
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/settings/:path*',
  ]
}; 