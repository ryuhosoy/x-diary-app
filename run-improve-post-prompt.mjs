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

  // 1. 過去1週間のKPIデータを取得
  const { data: userData, error: kpiError } = await supabase
    .from("users")
    .select("kpi_data")
    .single();

  if (kpiError) {
    console.error("❌ KPIデータ取得エラー:", kpiError.message);
    process.exit(1);
  }

  if (!userData || !userData.kpi_data) {
    console.log("✅ KPIデータが存在しません。");
    return;
  }

  const kpiData = userData.kpi_data;
  console.log(`📊 KPIデータを取得しました`);

  // 2. 現在の投稿プロンプトを取得
  const { data: promptData, error: promptError } = await supabase
    .from("users")
    .select("next_post_prompt")
    .single();

  if (promptError) {
    console.error("❌ プロンプト取得エラー:", promptError.message);
    process.exit(1);
  }

  if (!promptData || promptData.length === 0) {
    console.log("❌ 現在のプロンプトが見つかりません。");
    return;
  }

  const currentPrompt = promptData;
  console.log(`📝 現在のプロンプト: ${currentPrompt}`);

  // 3. KPIデータを集計
  const aggregatedMetrics = aggregateKPIData(kpiData);
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

function aggregateKPIData(kpiData) {
  // KPIデータを集計
  const posts = Array.isArray(kpiData) ? kpiData : [kpiData];
  const total = posts.length;
  
  const sumFavorites = posts.reduce((sum, post) => {
    const data = typeof post === 'string' ? JSON.parse(post) : post;
    return sum + (data.favorite_count || 0);
  }, 0);

  return {
    total_posts: total,
    avg_favorites: total > 0 ? sumFavorites / total : 0,
    best_performing_post: posts.reduce((best, current) => {
      const currentData = typeof current === 'string' ? JSON.parse(current) : current;
      const bestData = typeof best === 'string' ? JSON.parse(best) : best;
      return currentData.favorite_count > bestData.favorite_count ? currentData : bestData;
    }, posts[0])
  };
}

async function analyzePromptImprovement(currentPrompt, metrics) {
  const prompt = `
以下の投稿プロンプトと、そのプロンプトを使用して投稿した結果のメトリクスを分析してください。

現在のプロンプト:
${currentPrompt}

メトリクス:
- 投稿数: ${metrics.total_posts}
- 平均いいね数: ${metrics.avg_favorites.toFixed(2)}

最良の投稿のいいね数: ${metrics.best_performing_post.favorite_count}
最良の投稿内容: ${metrics.best_performing_post.text}

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
