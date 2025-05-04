'use client';
import React, { useEffect, useState } from 'react';
import { FileText, Calendar, MessageCircle, Heart, Share2 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

interface Post {
  user_id: string;
  post_content: string;
  posted_time: string;
}

export default function PostedPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { data, error } = await supabase
        .from('posted_posts')
        .select('*')
        .order('posted_time', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error);
      } else {
        setPosts(data || []);
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div className="flex-1 p-8 text-center">読み込み中...</div>;
  }

  return (
    <div className="flex-1 p-8">
      <div className="w-full">
        <h2 className="text-2xl font-bold mb-8 text-center">Posted Posts</h2>
        
        <div className="space-y-6">
          {posts.map((post, index) => (
            <div key={index} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <FileText className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold">Post #{index + 1}</h3>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar size={14} className="mr-1" />
                      <span>{new Date(post.posted_time).toLocaleDateString('ja-JP')}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-800 mb-4">
                {post.post_content}
              </p>
              
              <div className="flex items-center space-x-6 text-gray-600">
                <div className="flex items-center">
                  <MessageCircle size={16} className="mr-1" />
                  <span>128</span>
                </div>
                <div className="flex items-center">
                  <Heart size={16} className="mr-1" />
                  <span>1.2K</span>
                </div>
                <div className="flex items-center">
                  <Share2 size={16} className="mr-1" />
                  <span>458</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 