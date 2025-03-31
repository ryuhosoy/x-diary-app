import { NextRequest, NextResponse } from 'next/server';
import { requestClient } from '@/app/lib/twitter';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
    if (!process.env.TWITTER_API_KEY || !process.env.TWITTER_API_SECRET_KEY) {
      console.error('Twitter API credentials are not set');
      throw new Error('Twitter API credentials are not set');
    }

    const authLink = await requestClient.generateAuthLink(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/twitter/callback`
    );

    const response = NextResponse.json({ url: authLink.url });

    const cookieStore = await cookies();

    cookieStore.set('oauth_token', authLink.oauth_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24時間
    });

    cookieStore.set('oauth_token_secret', authLink.oauth_token_secret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', 
      maxAge: 60 * 60 * 24 // 24時間
    });

    return response;
  } catch (error) {
    console.error('Twitter認証エラー:', error);
    return NextResponse.json(
      { error: '認証リンクの生成に失敗しました' },
      { status: 500 }
    );
  }
}