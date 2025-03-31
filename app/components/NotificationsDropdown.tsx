import React from 'react';
import { MessageCircle, Heart, UserPlus, Share2 } from 'lucide-react';

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationsDropdown({ isOpen, onClose }: NotificationsDropdownProps) {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 1,
      type: 'post',
      icon: <MessageCircle size={16} className="text-blue-500" />,
      message: 'Your post has been published successfully',
      time: '2 minutes ago'
    },
    {
      id: 2,
      type: 'like',
      icon: <Heart size={16} className="text-red-500" />,
      message: '@johndoe liked your post',
      time: '15 minutes ago'
    },
    {
      id: 3,
      type: 'follow',
      icon: <UserPlus size={16} className="text-green-500" />,
      message: '@janedoe started following you',
      time: '1 hour ago'
    },
    {
      id: 4,
      type: 'retweet',
      icon: <Share2 size={16} className="text-purple-500" />,
      message: '@techuser retweeted your post',
      time: '2 hours ago'
    }
  ];

  return (
    <>
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      ></div>
      <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Notifications</h3>
            <button 
              className="text-sm text-blue-600 hover:text-blue-700"
              onClick={() => {/* Mark all as read */}}
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
                  {notification.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-gray-100">
          <button 
            className="w-full text-center text-sm text-blue-600 hover:text-blue-700"
            onClick={() => {/* View all notifications */}}
          >
            View all notifications
          </button>
        </div>
      </div>
    </>
  );
}