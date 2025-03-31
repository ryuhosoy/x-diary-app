import { NextResponse } from "next/server";
import { TwitterApi } from "twitter-api-v2";
import { cookies } from "next/headers";

export async function GET() {
  try {
    // クッキーに適切なものをセットしてそれを取り出したい

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const accessSecret = cookieStore.get("accessSecret")?.value;

    console.log("accessToken", accessToken);
    console.log("accessSecret", accessSecret);

    if (!accessToken || !accessSecret) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userClient = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY!,
      appSecret: process.env.TWITTER_API_SECRET_KEY!,
      accessToken: accessToken,
      accessSecret: accessSecret,
    });

    console.log("userClient", userClient);

    // ユーザー情報を取得
    const me = await userClient.v2.me();

    return NextResponse.json(me.data);
  } catch (error) {
    console.error("ユーザー情報取得エラー:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}
