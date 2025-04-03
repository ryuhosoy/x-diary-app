import { supabase } from "@/app/utils/supabase";
import { NextRequest, NextResponse } from "next/server";

// API Routeとしてエクスポートされる関数
export async function POST(req: NextRequest) {
  const { text, userId, scheduledTime } = await req.json();

  try {
    console.log("text", text);
    console.log("userId", userId);
    console.log("scheduledTime", scheduledTime);
    
    const { data, error } = await supabase
      .from("scheduled_posts")
      .insert([{
        user_id: parseInt(userId),
        post_content: text,
        scheduled_time: scheduledTime,
      }]);

    if (error) {
      console.error("エラー:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data ? data[0] : null });

  } catch (err) {
    console.error("エラー:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
