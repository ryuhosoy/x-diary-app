'use client'
import React, { useEffect, useState } from 'react';
import { Bell, Calendar, Clock } from 'lucide-react';
import NotificationsDropdown from '../components/NotificationsDropdown';
import { useUser } from '../context/UserContext';
import { supabase } from '@/app/utils/supabase';
import { Button } from '@/components/ui/button';
import { ArrangeButton } from '@/components/ArrangeButton';

export default function WritePage() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [text, setText] = useState('');
  const { userId, username } = useUser();
  const [scheduledDateTime, setScheduledDateTime] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
    hour: new Date().getHours(),
    minute: '00',
    period: 'AM'
  });
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Generate options for select elements
  const years = Array.from({length: 3}, (_, i) => new Date().getFullYear() + i);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const days = Array.from({length: 31}, (_, i) => i + 1);
  const hours = Array.from({length: 12}, (_, i) => i + 1);
  const minutes = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

  useEffect(() => {
    console.log("text", text);
  }, [text]);

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
  }, []);

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

  const handleSchedulePost = async () => {
    if (!userId || !username || !text) return;

    try {
      let hour = parseInt(scheduledDateTime.hour.toString());
      if (scheduledDateTime.period === 'PM' && hour !== 12) hour += 12;
      if (scheduledDateTime.period === 'AM' && hour === 12) hour = 0;

      const scheduledDate = new Date(
        scheduledDateTime.year,
        scheduledDateTime.month - 1,
        scheduledDateTime.day,
        hour,
        parseInt(scheduledDateTime.minute)
      );

      console.log("scheduledDateTime in handleSchedulePost", scheduledDateTime);
      console.log("scheduledDate in handleSchedulePost", scheduledDate);
      console.log("scheduledDate.toISOString() in handleSchedulePost", scheduledDate.toISOString());

      let imageUrl = null;
      
      if (selectedImage) {
        // ファイル名から日本語を除去し、英数字のみに
        const sanitizedFileName = selectedImage.name
          .replace(/[^\w\s.-]/g, '') // 英数字、スペース、ドット、ハイフン以外を削除
          .replace(/\s+/g, '-');     // スペースをハイフンに変換

        // ユニークなファイル名を生成（タイムスタンプを追加）
        const fileName = `${userId}/${Date.now()}-${sanitizedFileName}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('post-images')
          .upload(fileName, selectedImage);

        if (uploadError) throw uploadError;

        // 画像の公開URLを取得
        const { data: { publicUrl } } = supabase.storage
          .from('post-images')
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
        console.log("imageUrl in handleSchedulePost", imageUrl);
      }

      // 2. データベースには画像のURLを保存
      const response = await fetch('/api/supabase/insertScheduledPosts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          text,
          imageUrl,  // URLをテキストとして保存
          scheduledTime: scheduledDate.toISOString(),
        }),
      });

      if (!response.ok) throw new Error('Failed to schedule post');

      // 成功したらフォームをリセット
      setText('');
      setSelectedImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const formatScheduledTime = () => {
    const monthName = months[scheduledDateTime.month - 1];
    return `Scheduled for ${monthName} ${scheduledDateTime.day}, ${scheduledDateTime.year} at ${scheduledDateTime.hour}:${scheduledDateTime.minute} ${scheduledDateTime.period}`;
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 画像ファイルかどうかをチェック
      if (!file.type.startsWith('image/')) {
        alert('Only image files can be uploaded');
        return;
      }

      // ファイルサイズのチェック (20MB = 20 * 1024 * 1024 bytes)
      if (file.size > 20 * 1024 * 1024) {
        alert('Image size must be less than 20MB');
        return;
      }

      setSelectedImage(file);
      // プレビュー用のURLを作成
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleArrangeContent = async (arrangedContent: string) => {
    setText(arrangedContent);
  };

  return (
    <div className="flex-1 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">Good evening, User</h2>
            <p className="text-gray-600">Write your thoughts for today</p>
          </div>
          <div className="relative">
            <button 
              className="p-2 relative hover:bg-gray-100 rounded-full"
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

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col gap-4">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter your post content..."
              className="w-full h-32 p-2 border rounded-lg resize-none"
            />
            <ArrangeButton
              content={text}
              onArrange={handleArrangeContent}
              className="mb-4"
            />
          </div>

          {/* 画像プレビュー */}
          {imagePreview && (
            <div className="mt-4 relative">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="max-h-64 rounded-lg object-contain"
              />
              <button
                onClick={() => {
                  setSelectedImage(null);
                  setImagePreview(null);
                  URL.revokeObjectURL(imagePreview);
                }}
                className="absolute top-2 right-2 bg-gray-800 bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70"
              >
                ✕
              </button>
            </div>
          )}

          {/* 画像アップロードボタン */}
          <div className="mt-4 flex items-center space-x-2">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              <div className="flex items-center space-x-2 text-blue-500 hover:text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Add Image</span>
              </div>
            </label>
          </div>

          <div className="mt-4">
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-5 h-5" />
                <span className="font-medium">Schedule Post</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-600">Year</label>
                  <select
                    value={scheduledDateTime.year}
                    onChange={(e) => setScheduledDateTime({
                      ...scheduledDateTime,
                      year: parseInt(e.target.value)
                    })}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-600">Month</label>
                  <select
                    value={scheduledDateTime.month}
                    onChange={(e) => setScheduledDateTime({
                      ...scheduledDateTime,
                      month: parseInt(e.target.value)
                    })}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {months.map((month, index) => (
                      <option key={month} value={index + 1}>{month}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-600">Day</label>
                  <select
                    value={scheduledDateTime.day}
                    onChange={(e) => setScheduledDateTime({
                      ...scheduledDateTime,
                      day: parseInt(e.target.value)
                    })}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {days.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-600">Hour</label>
                  <select
                    value={scheduledDateTime.hour}
                    onChange={(e) => setScheduledDateTime({
                      ...scheduledDateTime,
                      hour: parseInt(e.target.value)
                    })}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {hours.map(hour => (
                      <option key={hour} value={hour}>{hour}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-600">Minute</label>
                  <select
                    value={scheduledDateTime.minute}
                    onChange={(e) => setScheduledDateTime({
                      ...scheduledDateTime,
                      minute: e.target.value
                    })}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {minutes.map(minute => (
                      <option key={minute} value={minute}>{minute}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-600">AM/PM</label>
                  <select
                    value={scheduledDateTime.period}
                    onChange={(e) => setScheduledDateTime({
                      ...scheduledDateTime,
                      period: e.target.value as 'AM' | 'PM'
                    })}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{formatScheduledTime()}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                onClick={handleSchedulePost}
                disabled={!text}
                className={`bg-blue-500 text-white px-6 py-2 rounded-lg flex items-center gap-2 ${!text ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
              >
                <Calendar className="w-4 h-4" />
                Schedule Post
              </Button>
            </div>
          </div>
        </div>

        {/* Recent Posts */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Recent Posts</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((post) => (
              <div key={post} className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Posted 2 hours ago</span>
                  <div className="flex items-center space-x-2 text-sm">
                    <span>❤️ 24</span>
                    <span>🔁 12</span>
                    <span>👁️ 1.2k</span>
                  </div>
                </div>
                <p className="text-gray-800">Had an amazing breakthrough today with the new project! The teams hard work is finally paying off. #coding #success</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}