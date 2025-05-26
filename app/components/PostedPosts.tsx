'use client';
import React, { useEffect, useState } from 'react';
// import { FileText, Calendar, MessageCircle, Heart, Share2 } from 'lucide-react';
import { FileText, Calendar, Bell } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import NotificationsDropdown from './NotificationsDropdown';
import { useUser } from '../context/UserContext';
import { supabase } from '@/app/utils/supabase';

interface Post {
  user_id: string;
  post_content: string;
  posted_time: string;
}

export default function PostedPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const { userId } = useUser();

  useEffect(() => {
    // 初期状態のチェック
    checkUnreadNotifications();

    // リアルタイムリスナーの設定
    const changes = supabase
      .channel("posted_posts")
      .on(
        "postgres_changes",
        {
          schema: "public",
          event: "*",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log("投稿の変更が検出されました:", payload);
          checkUnreadNotifications(); // 変更があったら未読状態を再チェック
        }
      )
      .subscribe();

    return () => {
      changes.unsubscribe();
    };
  }, [userId]);

  const checkUnreadNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from("posted_posts")
        .select("is_read_in_notifications")
        .eq("is_read_in_notifications", false)
        .eq('user_id', userId);

      if (error) throw error;

      setHasUnreadNotifications(data && data.length > 0);
    } catch (error) {
      console.error("未読通知のチェック中にエラーが発生しました:", error);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const userId = localStorage.getItem('user_id');
      if (!userId) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('posted_posts')
        .select('*')
        .eq('user_id', userId)
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
    return <div className="flex-1 p-8 text-center">Loading...</div>;
  }

  return (
    <div className="flex-1 p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-center sm:text-left">Posted Posts</h2>
          <div className="relative">
            <button 
              className="p-2 relative hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={24} />
              {hasUnreadNotifications && (
                <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              )}
            </button>
            <NotificationsDropdown 
              isOpen={showNotifications} 
              onClose={() => setShowNotifications(false)} 
              userId={userId || ''}
            />
          </div>
        </div>
        
        <div className="space-y-4 sm:space-y-6">
          {posts.map((post, index) => (
            <div key={index} className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <FileText className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base">Post #{index + 1}</h3>
                    <div className="flex items-center text-xs sm:text-sm text-gray-600">
                      <Calendar size={14} className="mr-1" />
                      <span>{new Date(post.posted_time).toLocaleDateString('ja-JP')}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-800 mb-4 text-sm sm:text-base whitespace-pre-wrap break-words">
                {post.post_content}
              </p>
              
              <div className="flex items-center space-x-6 text-gray-600">
                {/* <div className="flex items-center">
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
                </div> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 