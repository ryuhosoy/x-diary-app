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

async function improvePostPrompt() {
  console.log(`🕒 投稿プロンプトの改善分析を開始します...`);

  // 1. 過去1週間の投稿メトリクスを取得
  const { data: postMetrics, error: metricsError } = await supabase
    .from("post_metrics")
    .select("*")
    .gte("analyzed_at", oneWeekAgoISO)
    .order("analyzed_at", { ascending: false });

  if (metricsError) {
    console.error("❌ メトリクス取得エラー:", metricsError.message);
    process.exit(1);
  }

  if (!postMetrics || postMetrics.length === 0) {
    console.log("✅ 過去1週間のメトリクスデータはありません。");
    return;
  }

  console.log(`📊 過去1週間のメトリクス数: ${postMetrics.length}`);

  // 2. 現在の投稿プロンプトを取得
  const { data: promptData, error: promptError } = await supabase
    .from("user_prompts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1);

  if (promptError) {
    console.error("❌ プロンプト取得エラー:", promptError.message);
    process.exit(1);
  }

  if (!promptData || promptData.length === 0) {
    console.log("❌ 現在のプロンプトが見つかりません。");
    return;
  }

  const currentPrompt = promptData[0];
  console.log(`📝 現在のプロンプト: ${currentPrompt.prompt_content}`);

  // 3. メトリクスデータを集計
  const aggregatedMetrics = aggregateMetrics(postMetrics);
  console.log(`📈 集計されたメトリクス:`, aggregatedMetrics);

  // 4. AIにプロンプトの改善を判断させる
  const improvementResult = await analyzePromptImprovement(currentPrompt.prompt_content, aggregatedMetrics);
  
  if (!improvementResult.needsImprovement) {
    console.log(`✅ 現在のプロンプトは良好です。改善は不要です。`);
    return;
  }

  console.log(`🔄 プロンプトの改善が必要です。`);
  console.log(`💡 改善提案: ${improvementResult.suggestions.join(', ')}`);
  console.log(`✨ 新しいプロンプト: ${improvementResult.newPrompt}`);

  // 5. 新しいプロンプトをデータベースに保存
  const { error: insertError } = await supabase.from("user_prompts").insert({
    user_id: currentPrompt.user_id,
    prompt_content: improvementResult.newPrompt,
    previous_prompt_id: currentPrompt.id,
    improvement_reason: improvementResult.suggestions.join(', '),
    created_at: new Date().toISOString(),
  });

  if (insertError) {
    console.error(`❌ 新しいプロンプトの保存に失敗しました:`, insertError);
  } else {
    console.log(`📝 新しいプロンプトを保存しました`);
  }
}

function aggregateMetrics(metrics) {
  // メトリクスを集計
  const total = metrics.length;
  const sumLikes = metrics.reduce((sum, m) => sum + m.likes, 0);
  const sumRetweets = metrics.reduce((sum, m) => sum + m.retweets, 0);
  const sumReplies = metrics.reduce((sum, m) => sum + m.replies, 0);
  const sumImpressions = metrics.reduce((sum, m) => sum + m.impressions, 0);
  const sumEngagement = metrics.reduce((sum, m) => sum + m.engagement, 0);

  return {
    total_posts: total,
    avg_likes: total > 0 ? sumLikes / total : 0,
    avg_retweets: total > 0 ? sumRetweets / total : 0,
    avg_replies: total > 0 ? sumReplies / total : 0,
    avg_impressions: total > 0 ? sumImpressions / total : 0,
    avg_engagement: total > 0 ? sumEngagement / total : 0,
    best_performing_post: metrics.reduce((best, current) => 
      current.engagement > best.engagement ? current : best, 
      metrics[0]
    )
  };
}

async function analyzePromptImprovement(currentPrompt, metrics) {
  const prompt = `
以下の投稿プロンプトと、そのプロンプトを使用して投稿した結果のメトリクスを分析してください。

現在のプロンプト:
${currentPrompt}

メトリクス:
- 投稿数: ${metrics.total_posts}
- 平均いいね数: ${metrics.avg_likes.toFixed(2)}
- 平均リツイート数: ${metrics.avg_retweets.toFixed(2)}
- 平均リプライ数: ${metrics.avg_replies.toFixed(2)}
- 平均インプレッション数: ${metrics.avg_impressions.toFixed(2)}
- 平均エンゲージメント率: ${metrics.avg_engagement.toFixed(2)}%

最良の投稿のエンゲージメント率: ${metrics.best_performing_post.engagement.toFixed(2)}%

以下の点を判断してください:
1. このプロンプトは改善が必要かどうか
2. 改善が必要な場合、どのような点を改善すべきか
3. 改善された新しいプロンプト

以下のJSON形式で回答してください:
{
  "needsImprovement": true/false,
  "suggestions": ["改善点1", "改善点2", ...],
  "newPrompt": "改善された新しいプロンプト"
}
`;

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4-turbo-preview",
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(completion.choices[0].message.content);
    return result;
  } catch (error) {
    console.error("❌ AIによるプロンプト分析エラー:", error);
    // エラーの場合は改善不要と判断
    return {
      needsImprovement: false,
      suggestions: [],
      newPrompt: currentPrompt
    };
  }
}

improvePostPrompt();
