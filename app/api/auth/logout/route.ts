import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
export async function POST() {
  const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login`);

  // // クッキーを削除
  // const cookieStore = await cookies();
  // cookieStore.delete('accessToken');
  // cookieStore.delete('accessSecret');

  return response;
}