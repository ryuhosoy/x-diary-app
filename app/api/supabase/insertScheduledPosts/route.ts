import { supabase } from "@/app/utils/supabase";
import { NextRequest, NextResponse } from "next/server";

// API Routeとしてエクスポートされる関数
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, text, imageUrl, scheduledTime } = body;

    console.log("text", text);
    console.log("userId", userId);
    console.log("scheduledTime", scheduledTime);
    console.log("imageUrl", imageUrl);

    const { data, error } = await supabase.from("scheduled_posts").insert([
      {
        user_id: userId,
        post_content: text,
        scheduled_time: scheduledTime,
        image_url: imageUrl
      },
    ]);

    if (error) {
      console.error("エラー:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data ? data[0] : null });
  } catch (err) {
    console.error("エラー:", err);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
