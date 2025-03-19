'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, Edit3, TrendingUp, Clock, Star, Settings, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  showSidebar: boolean;
  setShowSidebar: (show: boolean) => void;
}

export function Sidebar({ showSidebar, setShowSidebar }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={`${showSidebar ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 p-4 transition-all duration-300 h-screen fixed`}>
      <div className="flex items-center justify-between mb-8">
        <h1 className={`font-bold text-xl ${!showSidebar && 'hidden'}`}>X Diary</h1>
        <button onClick={() => setShowSidebar(!showSidebar)} className="p-2 hover:bg-gray-100 rounded-lg">
          <Menu size={20} />
        </button>
      </div>
      
      <nav className="space-y-2">
        <Link 
          href="/"
          className={`w-full flex items-center p-3 rounded-lg ${pathname === '/' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
        >
          <Edit3 size={20} />
          {showSidebar && <span className="ml-3">Write Diary</span>}
        </Link>
        <Link 
          href="/AnalyticsPage"
          className={`w-full flex items-center p-3 rounded-lg ${pathname === '/AnalyticsPage' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
        >
          <TrendingUp size={20} />
          {showSidebar && <span className="ml-3">Analytics</span>}
        </Link>
        <Link 
          href="/SchedulePage"
          className={`w-full flex items-center p-3 rounded-lg ${pathname === '/SchedulePage' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
        >
          <Clock size={20} />
          {showSidebar && <span className="ml-3">Schedule</span>}
        </Link>
        <Link 
          href="/PremiumPage"
          className={`w-full flex items-center p-3 rounded-lg ${pathname === '/PremiumPage' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
        >
          <Star size={20} />
          {showSidebar && <span className="ml-3">Premium</span>}
        </Link>
      </nav>

      <div className="absolute bottom-4 space-y-2 w-full pr-4">
        <Link 
          href="/SettingsPage"
          className={`w-full flex items-center p-3 rounded-lg ${pathname === '/SettingsPage' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
        >
          <Settings size={20} />
          {showSidebar && <span className="ml-3">Settings</span>}
        </Link>
        <button className="w-full flex items-center p-3 rounded-lg hover:bg-gray-100 text-red-600">
          <LogOut size={20} />
          {showSidebar && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </div>
  );
}