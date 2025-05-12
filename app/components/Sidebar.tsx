'use client';

import React from 'react';
import { Menu, Edit3, TrendingUp, Clock, Settings, LogOut, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
type SidebarProps = {
  showSidebar: boolean;
  setShowSidebar: (show: boolean) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
};

export default function Sidebar({
  showSidebar,
  setShowSidebar,
  currentPage,
  setCurrentPage
}: SidebarProps) {
  const router = useRouter();
  const links = [
    { id: 'persona', label: 'Account Settings', icon: Edit3 },
    { id: 'templates', label: 'Post Templates', icon: FileText },
    { id: 'schedule', label: 'Post Schedule', icon: Clock },
    { id: 'posted', label: 'Posted Posts', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        // ログアウト成功時の処理
        router.push("/login");
      } else {
        console.error('ログアウトに失敗しました');
      }
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

  return (
    <div className={`${showSidebar ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 p-4 transition-all duration-300 h-screen fixed`}>
      <div className="flex items-center justify-between mb-8">
        <h1 className={`font-bold text-xl ${!showSidebar && 'hidden'}`}>X Diary</h1>
        <button 
          onClick={() => setShowSidebar(!showSidebar)} 
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <Menu size={20} />
        </button>
      </div>
      
      <nav className="space-y-2">
        {links.map((link) => (
          <button
            key={link.id}
            onClick={() => setCurrentPage(link.id)}
            className={`w-full flex items-center p-3 rounded-lg ${
              currentPage === link.id ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
            }`}
          >
            <link.icon size={20} />
            {showSidebar && <span className="ml-3">{link.label}</span>}
          </button>
        ))}
      </nav>

      <div className="absolute bottom-4 space-y-2 w-full pr-4">
        <button className="w-full flex items-center p-3 rounded-lg hover:bg-gray-100 text-red-600" onClick={handleLogout}>
          <LogOut size={20} />
          {showSidebar && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </div>
  );
}