'use client';

import React from 'react';
// import { Menu, Edit3, TrendingUp, Clock, Settings, LogOut, FileText } from 'lucide-react';
import { Edit3, LogOut, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';

type SidebarProps = {
  currentPage: string;
  setCurrentPage: (page: string) => void;
};

export default function Sidebar({
  currentPage,
  setCurrentPage
}: SidebarProps) {
  const router = useRouter();
  const links = [
    { id: 'persona', label: 'Account Settings', icon: Edit3 },
    // { id: 'templates', label: 'Post Templates', icon: FileText },
    // { id: 'schedule', label: 'Post Schedule', icon: Clock },
    { id: 'posted', label: 'Posted Posts', icon: FileText },
    // { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    // { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'GET',
      });

      if (response.ok) {
        // ログアウト成功時にリダイレクト
        router.push('/login');
      } else {
        console.error('ログアウトに失敗しました');
      }
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

  return (
    <div className="bg-white border-r border-gray-200 h-screen fixed w-16 flex flex-col items-center py-4">
      <div className="mb-8">
        <h1 className="font-bold text-xl">X</h1>
      </div>
      
      <nav className="flex-1 flex flex-col items-center space-y-4">
        {links.map((link) => (
          <button
            key={link.id}
            onClick={() => setCurrentPage(link.id)}
            className={`p-3 rounded-lg transition-colors ${
              currentPage === link.id ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
            }`}
            title={link.label}
          >
            <link.icon size={24} />
          </button>
        ))}
      </nav>

      <button 
        className="p-3 rounded-lg text-red-600 hover:bg-gray-100 transition-colors"
        onClick={handleLogout}
        title="Logout"
      >
        <LogOut size={24} />
      </button>
    </div>
  );
}