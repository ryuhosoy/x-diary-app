import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

// Supabaseクライアント作成
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// OpenAIクライアント作成
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 1週間前の日付を計算
const oneWeekAgo = new Date();
oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
const oneWeekAgoISO = oneWeekAgo.toISOString();

async function analyzePostPotential() {
  console.log(`🕒 過去1週間の投稿を分析中...`);

  // 1. Supabase から過去1週間の投稿を取得
  const { data: postedPosts, error } = await supabase
    .from("posted_posts")
    .select("*")
    .gte("posted_time", oneWeekAgoISO)
    .order("posted_time", { ascending: false });

  if (error) {
    console.error("❌ Supabase取得エラー:", error.message);
    process.exit(1);
  }

  if (!postedPosts || postedPosts.length === 0) {
    console.log("✅ 過去1週間の投稿はありません。");
    return;
  }

  console.log(`📊 過去1週間の投稿数: ${postedPosts.length}`);

  // 2. AIに最良の投稿を選ばせる
  const bestPost = await selectBestPost(postedPosts);

  if (!bestPost) {
    console.log("❌ 最良の投稿を選択できませんでした。");
    return;
  }

  console.log(`✨ 最良の投稿を選択しました: ${bestPost.post_content}`);

  // ユーザーのbest_post_id_for_improveを更新
  const { error: updateError } = await supabase
    .from("users")
    .update({ best_post_id_for_improve: bestPost.posted_post_id })
    .eq("user_id", bestPost.user_id);

  if (updateError) {
    console.error(
      `❌ ユーザーのbest_post_id更新エラー (ID: ${bestPost.user_id}):`,
      updateError
    );
    return;
  }

  console.log(`✅ ユーザーID: ${bestPost.user_id}のbest_post_id_for_improveを${bestPost.posted_post_id}に更新しました`);
}

async function selectBestPost(posts) {
  if (posts.length === 0) return null;
  if (posts.length === 1) return posts[0];

  // AIに最良の投稿を選ばせる
  const prompt = `
以下の投稿の中から、最も効果的で魅力的な投稿を1つ選んでください。
選んだ投稿のIDを返してください。

投稿リスト:
${posts.map((post, index) => `${index + 1}. ID: ${post.posted_post_id}, 内容: ${post.post_content}`).join('\n')}

選んだ投稿のIDのみを返してください。説明は不要です。
`;

  console.log("prompt", prompt);

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4-turbo-preview",
    });

    const selectedId = completion.choices[0].message.content.trim();
    console.log(`🤖 AIが選択した投稿ID: ${selectedId}`);

    // 選択されたIDの投稿を返す
    return posts.find(post => post.posted_post_id === selectedId) || posts[0];
  } catch (error) {
    console.error("❌ AIによる投稿選択エラー:", error);
    // エラーの場合は最初の投稿を返す
    return posts[0];
  }
}

analyzePostPotential();
