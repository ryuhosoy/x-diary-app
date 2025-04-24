// 指定時間にusers一人ずつプロンプトで投稿予約するように

import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
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
          content: "You are a helpful assistant that generates engaging social media posts."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    })
    return completion.choices[0].message.content
  } catch (error) {
    console.error('Error generating post content:', error)
    return null
  }
}

async function schedulePostsForUsers() {
  try {
    // Get all users with their next_post_prompt
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, next_post_prompt')
      .not('next_post_prompt', 'is', null)

    if (usersError) {
      throw usersError
    }

    for (const user of users) {
      // Generate post content using the user's prompt
      const postContent = await generatePostContent(user.next_post_prompt)
      
      if (!postContent) {
        console.error(`Failed to generate post content for user ${user.id}`)
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
            user_id: user.id,
            post_content: postContent,
            scheduled_time: scheduledTime.toISOString(),
            image_url: null // Optional: Add image generation if needed
          }
        ])

      if (insertError) {
        console.error(`Error scheduling post for user ${user.id}:`, insertError)
        continue
      }

      console.log(`Successfully scheduled post for user ${user.id}`)
    }
  } catch (error) {
    console.error('Error in schedulePostsForUsers:', error)
  }
}

// Run the scheduler
schedulePostsForUsers()
  .then(() => {
    console.log('Completed scheduling posts for users')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
