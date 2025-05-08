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
          content: "あなたは魅力的なソーシャルメディアの投稿を生成する優秀なアシスタントです。"
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

async function schedulePostsForUsers() {
  try {
    // Get all users with their next_post_prompt
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('user_id, next_post_prompt')
      .not('next_post_prompt', 'is', null)

    if (usersError) {
      throw usersError
    }

    for (const user of users) {
      // Generate post content using the user's prompt
      const postContent = await generatePostContent(user.next_post_prompt)

      console.log(`ユーザー ${user.user_id} の投稿内容: ${postContent}`)
      
      if (!postContent) {
        console.error(`ユーザー ${user.user_id} の投稿内容の生成に失敗しました`)
        continue
      }

      // Calculate scheduled time (e.g., 3 hours from now)
      const scheduledTime = new Date()
      scheduledTime.setHours(scheduledTime.getHours() + 3)

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
