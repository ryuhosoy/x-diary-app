import { chromium } from "playwright";
import dotenv from "dotenv";
import { createClient } from '@supabase/supabase-js';
dotenv.config();

const X_USERNAME = "";
const X_PASSWORD = "";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function loginToX(page) {
  await page.goto("https://x.com/i/flow/login", {
    waitUntil: "domcontentloaded",
  });

  // ホームページにリダイレクトされたかチェック
  if (page.url() === "https://x.com/home") {
    return; // すでにログインしている場合は処理を終了
  }

  // ユーザー名入力
  const usernameInput = await page.locator('input[name="text"]');
  await usernameInput.fill(X_USERNAME);
  await page.keyboard.press("Enter");
  await page.waitForTimeout(2000); // ロード待ち

  // パスワード入力
  const passwordInput = await page.locator('input[name="password"]');
  await passwordInput.fill(X_PASSWORD);
  await page.keyboard.press("Enter");
  await page.waitForTimeout(5000); // ログイン完了まで待つ
}

async function getTweetKPI(tweetId, page) {
  const tweetUrl = `https://x.com/i/web/status/${tweetId}`;
  await page.goto(tweetUrl, { waitUntil: "domcontentloaded" });

  // いいね数を取得
  const likeElement = await page.locator('[aria-label*="likes"]').first();
  let likeCount = 0;

  if (likeElement) {
    const ariaLabel = await likeElement.getAttribute('aria-label');
    const match = ariaLabel.match(/([\d,]+)\s+likes/);
    if (match) {
      likeCount = parseInt(match[1].replace(/,/g, ''), 10);
    }
  }

  // ツイートのテキストを取得
  const tweetTextElement = await page.locator('[data-testid="tweetText"]').first();
  const tweetText = await tweetTextElement.textContent();

  const kpiData = {
    text: tweetText,
    favorite_count: likeCount,
    tweet_id: tweetId
  };

  return kpiData;
}

async function main() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await loginToX(page);

  try {
    // Supabaseからユーザーを取得
    console.log("Supabaseからユーザーを取得しています...");
    const { data: users, error } = await supabase
      .from('users')
      .select('*');

    if (error) throw error;
    console.log(`${users.length}人のユーザーが見つかりました`);

    for (const user of users) {
      console.log(`\nユーザーID: ${user.user_id} の処理を開始します`);
      
      if (user.best_post_id_for_improve) {
        const bestPostId = user.best_post_id_for_improve;
        console.log(`最適な投稿ID: ${bestPostId}`);

        // 投稿された投稿の詳細を取得
        console.log("投稿の詳細を取得しています...");
        const { data: postedPosts, error: postError } = await supabase
          .from('posted_posts')
          .select('*')
          .eq('posted_post_id', bestPostId);

        if (postError) throw postError;

        if (postedPosts && postedPosts.length > 0) {
          const postedPost = postedPosts[0];
          const tweetId = postedPost.posted_post_id;
          console.log(`ツイートID: ${tweetId} が見つかりました`);

          try {
            // ツイートのKPIを取得
            console.log("ツイートのKPIを取得しています...");
            const kpiData = await getTweetKPI(tweetId, page);
            console.log(`KPIデータ: ${JSON.stringify(kpiData)}`);

            // Supabaseのユーザーデータを更新
            console.log("Supabaseのユーザーデータを更新しています...");
            const { error: updateError } = await supabase
              .from('users')
              .update({ kpi_data: kpiData })
              .eq('user_id', user.user_id);

            if (updateError) throw updateError;
            console.log("KPIデータの更新が完了しました");

          } catch (error) {
            console.error(`ユーザーID: ${user.user_id} のツイートデータ取得中にエラーが発生しました: ${error.message}`);
          }
        } else {
          console.log(`投稿ID: ${bestPostId} に対応する投稿が見つかりませんでした`);
        }
      } else {
        console.log("最適な投稿IDが設定されていません");
      }
    }
  } catch (error) {
    console.error(`エラーが発生しました: ${error.message}`);
  } finally {
    await browser.close();
  }
}

main();
