// import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
export async function POST() {
  // const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login`);
  const response = redirect(`https://x-diary-app.vercel.app/login`);

  // クッキーを削除
  const cookieStore = await cookies();
  cookieStore.delete('accessToken');
  cookieStore.delete('accessSecret');

  return response;
}