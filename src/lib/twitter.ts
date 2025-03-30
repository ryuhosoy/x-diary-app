import { TwitterApi } from 'twitter-api-v2';

export const TOKENS = {
  appKey: process.env.TWITTER_API_KEY!,
  appSecret: process.env.TWITTER_API_SECRET_KEY!,
};

export const requestClient = new TwitterApi({ ...TOKENS }); 