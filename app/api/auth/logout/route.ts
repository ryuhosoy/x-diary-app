import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login`);

  // クッキーを削除
  response.cookies.delete('oauth_token');
  response.cookies.delete('oauth_token_secret');

  return response;
}