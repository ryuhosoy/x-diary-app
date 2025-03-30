import { TwitterApi } from "twitter-api-v2";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import nextAuthOptions from "@/app/next-auth-options";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(nextAuthOptions);

    console.log("session in api/postTweet", session);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { text } = await req.json();

    const client = new TwitterApi({
      appKey: "Lq1Y8aJGpmQY4lnZZKVAnjj2q",
      appSecret: "ain8cEgIu58x6icCcRu52L6QSnYEe2ouFdidLvJOkNAEnODT3c",
      accessToken: session?.user?.accessToken, // セッションからアクセストークンを取得
      accessSecret: session?.user?.accessTokenSecret, // セッションからアクセスシークレットを取得
    });
    

    console.log("client in api/postTweet", client);

    const tweet = await client.v2.tweet(text);
    return NextResponse.json(tweet);

  } catch (error) {
    console.error("Tweet error:", error);
    return NextResponse.json(
      { error: "Failed to post tweet" },
      { status: 500 }
    );
  }
}
