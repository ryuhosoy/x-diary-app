import { OpenAI } from 'openai';
import { Post, PostMetrics, AnalysisResult, Persona } from '../types/schema';

export class Analyzer {
  private openai: OpenAI;

  constructor(openai: OpenAI) {
    this.openai = openai;
  }

  async analyzePost(post: Post, metrics: PostMetrics, persona: Persona): Promise<AnalysisResult> {
    const prompt = `
      Analyze this Twitter post and its performance:
      Content: ${post.content}
      Metrics: ${JSON.stringify(metrics)}
      Persona: ${JSON.stringify(persona)}
      
      Please provide:
      1. Analysis of the post's performance
      2. Suggestions for improvement
      3. Whether the current prompt needs improvement
      4. If needed, a new improved prompt
    `;

    const completion = await this.openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4-turbo-preview",
    });

    const analysis = this.parseAIResponse(completion.choices[0].message.content || '');

    return {
      postId: post.id,
      prompt: '', // 現在のプロンプト
      metrics,
      improvement: {
        needed: analysis.needsImprovement,
        suggestions: analysis.suggestions,
        newPrompt: analysis.newPrompt
      },
      createdAt: new Date()
    };
  }

  private parseAIResponse(response: string): {
    needsImprovement: boolean;
    suggestions: string[];
    newPrompt?: string;
  } {
    // AIの応答をパースする処理
    // 実際の実装ではより堅牢なパース処理が必要
    return {
      needsImprovement: false,
      suggestions: [],
      newPrompt: undefined
    };
  }

  async findBestPost(posts: Post[], metrics: PostMetrics[]): Promise<Post> {
    // 投稿の中から最もパフォーマンスの良いものを選ぶ
    const prompt = `
      Find the best performing post from these:
      Posts: ${JSON.stringify(posts)}
      Metrics: ${JSON.stringify(metrics)}
      
      Consider:
      1. Engagement rate
      2. Viral potential
      3. Content quality
      4. Audience response
    `;

    const completion = await this.openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4-turbo-preview",
    });

    // AIの応答から最適な投稿を選択
    // 実際の実装ではより堅牢な処理が必要
    return posts[0];
  }
} 