export interface Post {
  id: string;
  content: string;
  scheduledTime: Date;
  status: 'scheduled' | 'posted' | 'failed';
  accountId: string;
  metrics?: PostMetrics;
  createdAt: Date;
  updatedAt: Date;
}

export interface PostMetrics {
  likes: number;
  retweets: number;
  replies: number;
  impressions: number;
  engagement: number;
}

export interface Account {
  id: string;
  name: string;
  persona: Persona;
  twitterHandle: string;
  isPremium: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Persona {
  id: string;
  name: string;
  description: string;
  targetAudience: string[];
  interests: string[];
  toneOfVoice: string;
  hashtags: string[];
}

export interface AnalysisResult {
  postId: string;
  prompt: string;
  metrics: PostMetrics;
  improvement: {
    needed: boolean;
    suggestions: string[];
    newPrompt?: string;
  };
  createdAt: Date;
}

export interface WeeklyAnalysis {
  id: string;
  accountId: string;
  startDate: Date;
  endDate: Date;
  bestPostId: string;
  currentPrompt: string;
  improvedPrompt?: string;
  status: 'in_progress' | 'completed';
  createdAt: Date;
  updatedAt: Date;
} 