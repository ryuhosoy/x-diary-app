import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { name, description, targetAudience, expertise, tone, topics } = await request.json();

    const prompt = `以下の設定に基づいて、魅力的なソーシャルメディアの投稿を作成してください：

アカウントキャラクター: ${name}
アカウント説明: ${description}
ターゲット層: ${targetAudience}
専門分野: ${expertise}
投稿スタイル: ${tone}
投稿トピック: ${topics}

これらの設定を考慮して、aiっぽくなく、人間的な話し方で、日本語の自然な投稿を全角140文字・半角280文字以内で1つ作成してください。`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4-turbo-preview",
      temperature: 0.7,
    });

    const post = completion.choices[0].message.content;

    return NextResponse.json({ post });
  } catch (error) {
    console.error('Error generating test post:', error);
    return NextResponse.json(
      { error: 'Failed to generate test post' },
      { status: 500 }
    );
  }
} 