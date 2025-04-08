'use client'
import React, { useEffect, useState } from 'react';
import { Bell, Calendar, Clock } from 'lucide-react';
import NotificationsDropdown from '../components/NotificationsDropdown';
import { useUser } from '../context/UserContext';
import { supabase } from '@/app/utils/supabase';

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
        .eq("is_read_in_notifications", false);

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

      const response = await fetch('/api/supabase/insertScheduledPosts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          text,
          scheduledTime: scheduledDate.toISOString(),
        }),
      });

      if (!response.ok) throw new Error('Failed to schedule post');

      setText('');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const formatScheduledTime = () => {
    const monthName = months[scheduledDateTime.month];
    return `Scheduled for ${monthName} ${scheduledDateTime.day}, ${scheduledDateTime.year} at ${scheduledDateTime.hour}:${scheduledDateTime.minute} ${scheduledDateTime.period}`;
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
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's happening?"
            className="w-full p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />

          <div className="mt-4">
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg mt-4">
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
                      <option key={month} value={index}>{month}</option>
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

              <div className="text-sm text-gray-600 font-medium mt-4">
                {formatScheduledTime()}
              </div>
            </div>

            <button
              onClick={handleSchedulePost}
              disabled={!text}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors mt-4"
            >
              Schedule Post
            </button>
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