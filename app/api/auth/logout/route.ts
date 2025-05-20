// import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  // クッキーを削除
  const cookieStore = await cookies();
  cookieStore.delete('accessToken');
  cookieStore.delete('accessSecret');
  cookieStore.delete('user_id');
  
  return NextResponse.json({ success: true });
}