import { createClient } from "@supabase/supabase-js";
import { TwitterApi } from "twitter-api-v2";
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

  // 3. ユーザー情報を取得
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("user_id", bestPost.user_id)
    .single();

  if (userError || !userData) {
    console.error(
      `❌ ユーザー情報取得エラー (ID: ${bestPost.user_id}):`,
      userError
    );
    return;
  }

  // 4. Twitterクライアントを作成
  const twitterClient = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET_KEY,
    accessToken: userData.access_token,
    accessSecret: userData.access_secret,
  });

  // 5. ツイートのメトリクスを取得
  try {
    const tweet = await twitterClient.v2.tweet(bestPost.posted_post_id, {
      expansions: ['public_metrics'],
      'tweet.fields': ['public_metrics']
    });

    const metrics = tweet.data.public_metrics;
    
    // エンゲージメント率の計算
    const totalInteractions = 
      metrics.like_count + 
      metrics.retweet_count + 
      metrics.reply_count;
    
    const engagement = metrics.impression_count > 0 
      ? (totalInteractions / metrics.impression_count) * 100 
      : 0;

    // 6. メトリクスをデータベースに保存
    const { error: insertError } = await supabase.from("post_metrics").insert({
      user_id: bestPost.user_id,
      post_id: bestPost.posted_post_id,
      likes: metrics.like_count,
      retweets: metrics.retweet_count,
      replies: metrics.reply_count,
      impressions: metrics.impression_count,
      engagement: engagement,
      analyzed_at: new Date().toISOString(),
    });

    if (insertError) {
      console.error(`❌ メトリクスの保存に失敗しました:`, insertError);
    } else {
      console.log(`📝 メトリクスを保存しました`);
      console.log(`❤️ いいね数: ${metrics.like_count}`);
      console.log(`🔄 リツイート数: ${metrics.retweet_count}`);
      console.log(`💬 リプライ数: ${metrics.reply_count}`);
      console.log(`👁️ インプレッション数: ${metrics.impression_count}`);
      console.log(`📈 エンゲージメント率: ${engagement.toFixed(2)}%`);
    }
  } catch (err) {
    console.error(`🚨 ツイートメトリクスの取得エラー:`, err);
  }
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
