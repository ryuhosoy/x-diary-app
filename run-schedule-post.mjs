// 指定時間にusers一人ずつプロンプトで投稿予約するように

import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

async function generatePostContent(prompt) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "あなたは全角140文字・半角280文字以内の魅力的なソーシャルメディアの投稿を生成する優秀なアシスタントです。"
        },
        {
          role: "user",
          content: prompt
        }
      ]
    })
    return completion.choices[0].message.content
  } catch (error) {
    console.error('投稿内容の生成中にエラーが発生しました:', error)
    return null
  }
}

async function generatePromptFromSettings(settings) {
  const { name, description, targetAudience, expertise, tone, topics } = settings
  const prompt = `以下の設定に基づいて、魅力的なソーシャルメディアの投稿を作成してください：

アカウントキャラクター: ${name}
アカウント説明: ${description}
ターゲット層: ${targetAudience}
専門分野: ${expertise}
投稿スタイル: ${tone}
投稿トピック: ${topics}

これらの設定を考慮して、aiっぽくなく、人間的な話し方で、日本語の自然な投稿を全角140文字・半角280文字以内で1つ作成してください。`

  console.log('プロンプト:', prompt)
  return prompt
}

async function schedulePostsForUsers() {
  try {
    // Get all users with their settings
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('user_id, next_post_prompt, account_settings')

    if (usersError) {
      throw usersError
    }

    for (const user of users) {
      let postPrompt = user.next_post_prompt
      
      console.log(`ユーザー ${user.user_id} のアカウント設定:`, JSON.stringify(user.account_settings, null, 2))

      // If no prompt exists, generate one from account settings
      if (!postPrompt && user.account_settings) {
        postPrompt = await generatePromptFromSettings(user.account_settings)
        
        // Save the generated prompt
        const { error: updateError } = await supabase
          .from('users')
          .update({ next_post_prompt: postPrompt })
          .eq('user_id', user.user_id)

        if (updateError) {
          console.error(`ユーザー ${user.user_id} のプロンプト更新中にエラーが発生しました:`, updateError)
          continue
        }
      }

      // Skip if no prompt and no settings available
      if (!postPrompt) {
        console.log(`ユーザー ${user.user_id} はプロンプトもアカウント設定も持っていません`)
        continue
      }

      // Generate post content using the prompt
      const postContent = await generatePostContent(postPrompt)

      console.log(`ユーザー ${user.user_id} の投稿内容: ${postContent}`)
      
      if (!postContent) {
        console.error(`ユーザー ${user.user_id} の投稿内容の生成に失敗しました`)
        continue
      }

      // Calculate scheduled time (e.g., 3 hours from now)
      const scheduledTime = new Date()
      scheduledTime.setHours(scheduledTime.getHours())

      // Insert scheduled post
      const { error: insertError } = await supabase
        .from('scheduled_posts')
        .insert([
          {
            user_id: user.user_id,
            post_content: postContent,
            scheduled_time: scheduledTime.toISOString(),
            image_url: null // Optional: Add image generation if needed
          }
        ])

      if (insertError) {
        console.error(`ユーザー ${user.user_id} の投稿スケジュール設定中にエラーが発生しました:`, insertError)
        continue
      }

      console.log(`ユーザー ${user.user_id} の投稿を ${scheduledTime.toLocaleString('ja-JP')} に投稿するようスケジュール設定しました`)
    }
  } catch (error) {
    console.error('schedulePostsForUsers関数でエラーが発生しました:', error)
  }
}

// Run the scheduler
schedulePostsForUsers()
  .then(() => {
    console.log('全ユーザーの投稿スケジュール設定が完了しました')
    process.exit(0)
  })
  .catch((error) => {
    console.error('致命的なエラーが発生しました:', error)
    process.exit(1)
  })
