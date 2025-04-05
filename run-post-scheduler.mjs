import { createClient } from '@supabase/supabase-js';
import { TwitterApi } from 'twitter-api-v2';

// Supabaseクライアント作成
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const now = new Date();
const nowISO = now.toISOString().slice(0, 16); // 'YYYY-MM-DDTHH:MM' まで比較

async function postScheduledTweets() {
  console.log(`🕒 ${nowISO}の予約投稿をチェック中...`);

  // 1. Supabase から予約投稿を取得
  const { data: scheduledPosts, error } = await supabase
    .from('scheduled_posts')
    .select('*')
    .lte('scheduled_time', nowISO);

  if (error) {
    console.error('❌ Supabase取得エラー:', error.message);
    process.exit(1);
  }

  if (!scheduledPosts || scheduledPosts.length === 0) {
    console.log('✅ 現在投稿予定はありません。');
    return;
  }

  // 2. 各投稿をTwitterに投稿
  for (const post of scheduledPosts) {
    try {
      // ユーザー情報を取得
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', post.user_id)
        .single();

      if (userError || !userData) {
        console.error(`❌ ユーザー情報取得エラー (ID: ${post.user_id}):`, userError);
        continue;
      }

      // ユーザーごとのTwitterクライアントを作成
      const userTwitterClient = new TwitterApi({
        appKey: process.env.TWITTER_API_KEY,
        appSecret: process.env.TWITTER_API_SECRET_KEY,
        accessToken: userData.access_token,
        accessSecret: userData.access_secret,
      });

      console.log("TWITTER_API_KEY  ", process.env.TWITTER_API_KEY);
      console.log("TWITTER_API_SECRET_KEY", process.env.TWITTER_API_SECRET_KEY);

      const tweet = await userTwitterClient.v2.tweet(post.post_content);
      console.log(`🐦 ツイートID: ${tweet.data.id}を投稿しました`);

      // 3. 投稿後、Supabaseから削除
      await supabase
        .from('scheduled_posts')
        .delete()
        .eq('id', post.id);

      console.log(`🗑️ 予約投稿ID: ${post.id}を削除しました`);
    } catch (err) {
      console.error(`🚨 ID ${post.id}のツイート投稿エラー:`, err);
    }
  }
}

postScheduledTweets();