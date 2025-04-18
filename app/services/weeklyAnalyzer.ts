import { Post, Account, WeeklyAnalysis, AnalysisResult } from '../types/schema';
import { PostManager } from './postManager';
import { Analyzer } from './analyzer';
import { KPIManager } from './kpiManager';

export class WeeklyAnalyzer {
  private postManager: PostManager;
  private analyzer: Analyzer;
  private kpiManager: KPIManager;

  constructor(
    postManager: PostManager,
    analyzer: Analyzer,
    kpiManager: KPIManager
  ) {
    this.postManager = postManager;
    this.analyzer = analyzer;
    this.kpiManager = kpiManager;
  }
  

  async analyzeWeek(account: Account, startDate: Date, endDate: Date): Promise<WeeklyAnalysis> {
    // 週次分析の作成
    const analysis: WeeklyAnalysis = {
      id: crypto.randomUUID(),
      accountId: account.id,
      startDate,
      endDate,
      bestPostId: '',
      currentPrompt: '', // 現在のプロンプト
      status: 'in_progress',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // 1. 投稿の取得
    const posts = await this.getWeeklyPosts(account.id, startDate, endDate);

    // 2. 最良の投稿を選択
    const bestPost = await this.analyzer.findBestPost(posts, []);
    analysis.bestPostId = bestPost.id;

    // 3. 最良の投稿のメトリクスを取得
    const metrics = await this.kpiManager.getPostMetrics(bestPost);

    // 4. 投稿の分析
    const analysisResult = await this.analyzer.analyzePost(
      bestPost,
      metrics,
      account.persona
    );

    // 5. プロンプトの改善判断
    if (analysisResult.improvement.needed) {
      analysis.improvedPrompt = analysisResult.improvement.newPrompt;
    }

    analysis.status = 'completed';
    analysis.updatedAt = new Date();

    return analysis;
  }

  private async getWeeklyPosts(
    accountId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Post[]> {
    // 週間の投稿を取得
    // 実際の実装ではデータベースから取得する処理を実装
    return [];
  }

  async startNewWeek(account: Account): Promise<void> {
    const now = new Date();
    const startDate = new Date(now.setDate(now.getDate() - 7));
    const endDate = new Date();

    await this.analyzeWeek(account, startDate, endDate);
  }

  async getAnalysisHistory(accountId: string): Promise<WeeklyAnalysis[]> {
    // 分析履歴を取得
    // 実際の実装ではデータベースから取得する処理を実装
    return [];
  }
} 