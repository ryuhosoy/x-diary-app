import { TwitterApi } from 'twitter-api-v2';
import { Post, PostMetrics } from '../types/schema';

export class KPIManager {
  private twitterClient: TwitterApi;

  constructor(twitterClient: TwitterApi) {
    this.twitterClient = twitterClient;
  }

  async getPostMetrics(post: Post): Promise<PostMetrics> {
    try {
      // ツイートのメトリクスを取得
      const tweet = await this.twitterClient.v2.tweet(post.id, {
        expansions: ['public_metrics'],
        'tweet.fields': ['public_metrics']
      });

      const metrics = tweet.data.public_metrics;

      return {
        likes: metrics.like_count,
        retweets: metrics.retweet_count,
        replies: metrics.reply_count,
        impressions: metrics.impression_count,
        engagement: this.calculateEngagement(metrics)
      };
    } catch (error) {
      console.error('Error fetching post metrics:', error);
      return {
        likes: 0,
        retweets: 0,
        replies: 0,
        impressions: 0,
        engagement: 0
      };
    }
  }

  private calculateEngagement(metrics: any): number {
    // エンゲージメント率の計算
    // (いいね + リツイート + リプライ) / インプレッション数
    const totalInteractions = 
      metrics.like_count + 
      metrics.retweet_count + 
      metrics.reply_count;
    
    return metrics.impression_count > 0 
      ? (totalInteractions / metrics.impression_count) * 100 
      : 0;
  }

  async getAccountMetrics(accountId: string, startDate: Date, endDate: Date): Promise<PostMetrics[]> {
    // アカウントの全投稿メトリクスを取得
    // 実際の実装ではデータベースから取得する処理を実装
    return [];
  }

  async getBestPerformingPosts(accountId: string, limit: number = 10): Promise<Post[]> {
    // パフォーマンスの良い投稿を取得
    // 実際の実装ではデータベースから取得する処理を実装
    return [];
  }
} 