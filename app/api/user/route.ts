import { NextResponse } from "next/server";
import { TwitterApi } from "twitter-api-v2";
import { cookies } from "next/headers";
import { supabase } from "@/app/utils/supabase";

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
    const currentUser = await userClient.currentUserV2();

    if (currentUser.data) {
      const { data, error } = await supabase
        .from("users")
        .upsert([
          {
            user_id: currentUser.data.id,
            username: currentUser.data.username,
            access_token: accessToken,
            access_secret: accessSecret,
          },
        ], { onConflict: 'user_id' });

      if (error) {
        console.error("ユーザー情報の更新エラー:", error);
      } else {
        console.log("ユーザー情報の更新成功:", data);
      }
    }

    console.log("currentUser", currentUser);

    return NextResponse.json(currentUser.data);
  } catch (error) {
    console.error("ユーザー情報取得エラー:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}
