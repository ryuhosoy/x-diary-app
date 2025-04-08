import React, { useEffect, useState } from "react";
import { MessageCircle, Heart, UserPlus, Share2 } from "lucide-react";
import { supabase } from "@/app/utils/supabase";

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Notification {
  id: number | string;
  type: string;
  icon: React.ReactNode;
  message: string;
  time: string;
}

export default function NotificationsDropdown({
  isOpen,
  onClose,
}: NotificationsDropdownProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // 初期データの取得
    const fetchInitialData = async () => {
      const { data, error } = await supabase
        .from('posted_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('データの取得に失敗しました:', error);
        return;
      }

      const formattedNotifications = data.map(post => ({
        id: post.id,
        type: "post",
        icon: <MessageCircle size={16} className="text-blue-500" />,
        message: `「${post.post_content}」が投稿されました`,
        time: new Date(post.created_at).toLocaleString(),
      }));

      setNotifications(formattedNotifications);
    };

    fetchInitialData();

    // リアルタイムリスナーの設定
    console.log("supabase", supabase);
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

          // 新しい通知を追加
          const newNotification = {
            id: Date.now(),
            type: "post",
            icon: <MessageCircle size={16} className="text-blue-500" />,
            message: `「${payload}が${payload.eventType}されました`,
            time: new Date().toLocaleString(),
          };

          setNotifications((prev) => [newNotification, ...prev]);
        }
      )
      .subscribe();

    // クリーンアップ関数
    return () => {
      changes.unsubscribe();
    };
  }, []);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose}></div>
      <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Notifications</h3>
            <button
              className="text-sm text-blue-600 hover:text-blue-700"
              onClick={() => {
                /* Mark all as read */
              }}
            >
              Mark all as read
            </button>
          </div>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 cursor-pointer"
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-gray-50 rounded-full">
                  {/* {notification.icon} */}
                  <MessageCircle size={16} className="text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {notification.time}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-gray-100">
          <button
            className="w-full text-center text-sm text-blue-600 hover:text-blue-700"
            onClick={() => {
              /* View all notifications */
            }}
          >
            View all notifications
          </button>
        </div>
      </div>
    </>
  );
}
