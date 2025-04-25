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

async function improvePostPrompt() {
  console.log(`🕒 投稿プロンプトの改善分析を開始します...`);

  // 1. KPIデータのあるユーザーを全て取得
  const { data: users, error: usersError } = await supabase
    .from("users")
    .select("*")
    .not("kpi_data", "is", null);

  if (usersError) {
    console.error("❌ ユーザーデータ取得エラー:", usersError.message);
    process.exit(1);
  }

  if (!users || users.length === 0) {
    console.log("✅ KPIデータのあるユーザーが存在しません。");
    return;
  }

  // 各ユーザーに対して処理を実行
  for (const user of users) {
    console.log(`👤 ユーザーID: ${user.user_id}の処理を開始`);

    const kpiData = user.kpi_data;
    console.log(`📊 KPIデータを取得しました`, kpiData);

    // 2. 現在の投稿プロンプトを取得
    const { data: promptData, error: promptError } = await supabase
      .from("users")
      .select("next_post_prompt")
      .eq("user_id", user.user_id)
      .single();

    if (promptError) {
      console.error(`❌ プロンプト取得エラー (ユーザーID: ${user.user_id}):`, promptError.message);
      continue;
    }

    if (!promptData) {
      console.log(`❌ ユーザーID: ${user.user_id}の現在のプロンプトが見つかりません。`);
      continue;
    }

    const currentPrompt = promptData.next_post_prompt;
    console.log(`📝 現在のプロンプト: ${currentPrompt}`);

    // 3. KPIデータを解析用に整形
    const metrics = {
      total_posts: 1,
      avg_favorites: kpiData.favorite_count,
      best_performing_post: {
        favorite_count: kpiData.favorite_count,
        text: kpiData.text
      }
    };
    console.log(`📈 メトリクス:`, metrics);

    // 4. AIにプロンプトの改善を判断させる
    const improvementResult = await analyzePromptImprovement(currentPrompt, metrics);

    console.log(`🔄 プロンプトの改善結果:`, improvementResult);
    
    let promptToSave = currentPrompt;
    let improvementReason = '';

    if (!improvementResult.needsImprovement) {
      console.log(`✅ 現在のプロンプトは良好です。改善は不要です。`);
    } else {
      console.log(`🔄 プロンプトの改善が必要です。`);
      console.log(`💡 改善提案: ${improvementResult.suggestions.join(', ')}`);
      console.log(`✨ 新しいプロンプト: ${improvementResult.newPrompt}`);
      promptToSave = improvementResult.newPrompt;
      improvementReason = improvementResult.suggestions.join(', ');
    }

    // 5. プロンプトをデータベースに保存
    const { error: updateError } = await supabase
      .from("users")
      .update({ next_post_prompt: promptToSave })
      .eq("user_id", user.user_id);

    if (updateError) {
      console.error(`❌ プロンプトの保存に失敗しました (ユーザーID: ${user.user_id}):`, updateError);
    } else {
      console.log(`📝 プロンプトを保存しました`);
    }

    // // 6. プロンプト履歴を保存
    // const { error: insertError } = await supabase.from("user_prompts").insert({
    //   user_id: user.user_id,
    //   prompt_content: promptToSave,
    //   previous_prompt_id: promptData.id,
    //   improvement_reason: improvementReason,
    //   created_at: new Date().toISOString(),
    // });

    // if (insertError) {
    //   console.error(`❌ プロンプト履歴の保存に失敗しました (ユーザーID: ${user.user_id}):`, insertError);
    // }

    console.log(`✅ ユーザーID: ${user.user_id}の処理が完了しました`);
  }
}

async function analyzePromptImprovement(currentPrompt, metrics) {
  const prompt = `
以下の投稿プロンプトと、そのプロンプトを使用して投稿した結果のメトリクスを分析してください。

現在のプロンプト:
${currentPrompt}

メトリクス:
- いいね数: ${metrics.avg_favorites}

投稿内容: ${metrics.best_performing_post.text}

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
