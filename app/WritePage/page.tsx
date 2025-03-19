import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import NotificationsDropdown from '../components/NotificationsDropdown';

export default function WritePage() {
  const [showNotifications, setShowNotifications] = useState(false);

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
              <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            <NotificationsDropdown 
              isOpen={showNotifications} 
              onClose={() => setShowNotifications(false)} 
            />
          </div>
        </div>

        {/* Editor */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <textarea 
            className="w-full h-48 resize-none border-0 focus:ring-0 text-lg"
            placeholder="What's on your mind today?"
          ></textarea>
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-4">
              <select className="border rounded-lg px-3 py-2 text-sm">
                <option>AI Style: Professional</option>
                <option>AI Style: Casual</option>
                <option>AI Style: Engaging</option>
              </select>
              <select className="border rounded-lg px-3 py-2 text-sm">
                <option>Post at: Best Time</option>
                <option>Post at: Custom Time</option>
                <option>Post Now</option>
              </select>
            </div>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
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
                <p className="text-gray-800">Had an amazing breakthrough today with the new project! The team's hard work is finally paying off. #coding #success</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}