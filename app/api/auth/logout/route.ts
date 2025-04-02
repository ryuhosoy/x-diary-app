import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login`);

  const cookieStore = await cookies();
  cookieStore.delete('accessToken');
  cookieStore.delete('accessSecret');
  
  return response;
}