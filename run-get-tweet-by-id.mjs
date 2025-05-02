import { chromium } from "playwright";
import dotenv from "dotenv";
dotenv.config();

const X_USERNAME = "";
const X_PASSWORD = "";

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

  const kpiData = {
    tweet_id: tweetId,
    like_count: likeCount
  };

  return kpiData;
}

async function main() {
  const browser = await chromium.launch({ headless: false }); // 開発中は headless: false 推奨
  const context = await browser.newContext();
  const page = await context.newPage();

  await loginToX(page);

  const tweetId = "1910105444061786148"; // ← 任意のツイートIDに置き換え
  const kpi = await getTweetKPI(tweetId, page);
  console.log("✅ KPI Data:", kpi);

  await browser.close();
}

main();
