import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { content, style } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: "投稿内容が指定されていません" },
        { status: 400 }
      );
    }

    const prompt = `
以下の投稿内容を${style || "casual"}なスタイルでアレンジしてください。
元の意味や意図は保持しつつ、より魅力的な表現にしてください。
140文字以内に収めてください。

元の投稿内容：
${content}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const arrangedContent = response.choices[0].message.content?.trim() || content;

    return NextResponse.json({ content: arrangedContent });
  } catch (error) {
    console.error("APIエラー:", error);
    return NextResponse.json(
      { error: "投稿内容のアレンジに失敗しました" },
      { status: 500 }
    );
  }
} 