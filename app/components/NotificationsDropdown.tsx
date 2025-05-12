import React, { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { supabase } from "@/app/utils/supabase";

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

interface Notification {
  id: number | string;
  type: string;
  icon: React.ReactNode;
  message: string;
  time: string;
  is_read_in_notifications: boolean;
}

export default function NotificationsDropdown({
  isOpen,
  onClose,
  userId,
}: NotificationsDropdownProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // リアルタイムで通知が追加されたらfetchInitialDataを呼び出し再度レンダリングする

  console.log("userId in notifications", userId);

  const fetchInitialData = async () => {
    const { data, error } = await supabase
      .from("posted_posts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("データの取得に失敗しました:", error);
      return;
    }

    const formattedNotifications = data.map((post) => ({
      id: post.id,
      type: "post",
      icon: <MessageCircle size={16} className="text-blue-500" />,
      message: `The tweet "${post.post_content}" has been posted.`,
      time: new Date(post.created_at).toLocaleString(),
      is_read_in_notifications: post.is_read_in_notifications,
    }));

    setNotifications(formattedNotifications);
    console.log("formattedNotifications", formattedNotifications);
  };

  useEffect(() => {
    // 初期データの取得

    fetchInitialData();

    // リアルタイムリスナーの設定
    console.log("supabase", supabase);
    const changes = supabase
      .channel("posted_posts")
      .on(
        "postgres_changes",
        {
          schema: "public",
          event: "INSERT",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log("投稿の変更が検出されました:", payload);

          // 新しい通知を追加
          const newNotification = {
            id: Date.now(),
            type: "post",
            icon: <MessageCircle size={16} className="text-blue-500" />,
            message: `「${payload.new.post_content}」が投稿されました`,
            time: new Date().toLocaleString(),
            is_read_in_notifications: false,
          };

          setNotifications((prev) => [newNotification, ...prev]);
          console.log("notifications after new notification", notifications);
          fetchInitialData();
        }
      )
      .subscribe();

    // クリーンアップ関数
    return () => {
      changes.unsubscribe();
    };
  }, []);

  console.log("notifications", notifications);

  useEffect(() => {
    fetchInitialData();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleMarkAllAsRead = async () => {
    try {
      // posted_postsテーブルの全ての通知を既読に更新
      const { error } = await supabase
        .from("posted_posts")
        .update({ is_read_in_notifications: true })
        .eq("is_read_in_notifications", false)
        .eq("user_id", userId);

      if (error) throw error;

      // ローカルの通知状態も更新
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read_in_notifications: true }))
      );
    } catch (error) {
      console.error("通知の一括既読更新に失敗しました:", error);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose}></div>
      <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Notifications</h3>
            <button
              className="text-sm text-blue-600 hover:text-blue-700"
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </button>
          </div>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 cursor-pointer ${
                !notification.is_read_in_notifications ? "bg-blue-50" : ""
              }`}
              onClick={async () => {
                // 通知を既読にする
                await supabase
                  .from("posted_posts")
                  .update({ is_read_in_notifications: true })
                  .eq("id", notification.id);

                setNotifications((prev) =>
                  prev.map((n) =>
                    n.id === notification.id
                      ? { ...n, is_read_in_notifications: true }
                      : n
                  )
                );

                console.log("notification.id", notification.id);
                console.log("notification are read");
              }}
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-gray-50 rounded-full">
                  {/* {notification.icon} */}
                  <MessageCircle size={16} className="text-blue-500" />
                </div>
                <div className="flex-1">
                  <p
                    className={`text-sm ${
                      !notification.is_read_in_notifications
                        ? "font-semibold text-gray-900"
                        : "text-gray-800"
                    }`}
                  >
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
        {/* <div className="p-4 border-t border-gray-100">
          <button
            className="w-full text-center text-sm text-blue-600 hover:text-blue-700"
            onClick={() => {}}
          >
            View all notifications
          </button>
        </div> */}
      </div>
    </>
  );
}
