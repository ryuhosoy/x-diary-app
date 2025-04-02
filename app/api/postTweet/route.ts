import { TwitterApi } from "twitter-api-v2";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const accessSecret = cookieStore.get("accessSecret")?.value;

    const { text } = await req.json();

    const client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY!,
      appSecret: process.env.TWITTER_API_SECRET_KEY!,
      accessToken: accessToken,
      accessSecret: accessSecret,
    });
    console.log("client in api/postTweet", client);

    const tweet = await client.v2.tweet(text);
    console.log("tweet in api/postTweet", tweet);

    return NextResponse.json(tweet);
  } catch (error) {
    console.error("Tweet error:", error);
    return NextResponse.json(
      { error: "Failed to post tweet" },
      { status: 500 }
    );
  }
}
