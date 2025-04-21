import { TwitterApi } from 'twitter-api-v2';
import { Post, Account, Persona } from './app/types/schema';
import { OpenAI } from 'openai';

export class PostManager {
  private twitterClient: TwitterApi;
  private openai: OpenAI;

  constructor(twitterClient: TwitterApi, openai: OpenAI) {
    this.twitterClient = twitterClient;
    this.openai = openai;
  }

  async createPost(account: Account, content: string, scheduledTime: Date): Promise<Post> {
    // 投稿内容の生成と最適化
    const optimizedContent = await this.optimizeContent(content, account.persona);
    
    // 投稿の作成
    const post: Post = {
      id: crypto.randomUUID(),
      content: optimizedContent,
      scheduledTime,
      status: 'scheduled',
      accountId: account.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return post;
  }

  async postToTwitter(post: Post, account: Account): Promise<boolean> {
    try {
      await this.twitterClient.v2.tweet({
        text: post.content
      });
      
      post.status = 'posted';
      post.updatedAt = new Date();
      
      return true;
    } catch (error) {
      console.error('Error posting to Twitter:', error);
      post.status = 'failed';
      post.updatedAt = new Date();
      return false;
    }
  }

  private async optimizeContent(content: string, persona: Persona): Promise<string> {
    const prompt = `
      Optimize this content for Twitter:
      Content: ${content}
      Persona: ${JSON.stringify(persona)}
      
      Requirements:
      1. Keep it under 280 characters
      2. Match the persona's tone of voice
      3. Add relevant hashtags
      4. Make it engaging
    `;

    const completion = await this.openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4-turbo-preview",
    });

    return completion.choices[0].message.content || content;
  }

  async schedulePost(post: Post): Promise<void> {
    // 投稿予約の処理
    // ここでデータベースに保存する処理を実装
  }

  async getScheduledPosts(): Promise<Post[]> {
    // 予約投稿の取得
    // データベースから取得する処理を実装
    return [];
  }
} 