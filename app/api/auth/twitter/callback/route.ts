import { NextRequest, NextResponse } from "next/server";
import { TOKENS } from "@/app/lib/twitter";
import { cookies } from "next/headers";
import { TwitterApi } from "twitter-api-v2";

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("oauth_token") as string;
    const verifier = req.nextUrl.searchParams.get("oauth_verifier") as string;
    const savedToken = req.cookies.get("oauth_token")?.value;
    const savedSecret = req.cookies.get("oauth_token_secret")?.value;

    if (!token || !verifier) {
      console.error("OAuth tokens missing");
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/login?error=invalid_request`
      );
    }

    try {
      const tempClient = new TwitterApi({
        ...TOKENS,
        accessToken: token,
        accessSecret: savedSecret,
      });

      const { accessToken, accessSecret, screenName, userId } = await tempClient.login(verifier);

      const cookieStore = await cookies();

      cookieStore.set('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 // 24時間
      });
  
      cookieStore.set('accessSecret', accessSecret, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax', 
        maxAge: 60 * 60 * 24 // 24時間
      });

      console.log('accessToken in callback', accessToken);
      console.log('accessSecret in callback', accessSecret);

      // デバッグ用のログ
      console.log("Login successful:", { screenName, userId });

      //   const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`);
      const response = NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}`
      );

    //   const userResponse = await fetch(
    //     `${process.env.NEXT_PUBLIC_APP_URL}/api/user`
    //   );
    //   const userData = await userResponse.json();
    //   console.log("ログインユーザー情報:", userData);

      return response;
    } catch (loginError) {
      console.error("Twitter login error:", loginError);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/login?error=auth_failed`
      );
    }
  } catch (error) {
    console.error("Callback error:", error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/login?error=auth_failed`
    );
  }
}
