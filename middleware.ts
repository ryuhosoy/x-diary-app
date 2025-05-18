import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 認証が必要なパスのパターン
  const protectedPaths = ['/'];
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname === path
  );

  // 認証が不要なパスのパターン
  const publicPaths = ['/login', '/api/auth/twitter', '/api/auth/twitter/callback'];
  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  // 認証チェック
  const accessToken = request.cookies.get('accessToken');
  const accessSecret = request.cookies.get('accessSecret');

  // 保護されたパスにアクセスし、認証されていない場合
  if (isProtectedPath && (!accessToken || !accessSecret)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 認証済みユーザーがログインページにアクセスした場合
  if (isPublicPath && accessToken && accessSecret) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// ミドルウェアを適用するパスを指定
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
