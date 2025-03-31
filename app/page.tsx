"use client";

import { useEffect, useState } from "react";
import WritePage from "./components/Write";
import AnalyticsPage from "./components/Analytics";
import SchedulePage from "./components/Schedule";
import PremiumPage from "./components/Premium";
import SettingsPage from "./components/Settings";
import Sidebar from "./components/Sidebar";

export default function Home() {
  const [showSidebar, setShowSidebar] = useState(true);
  const [currentPage, setCurrentPage] = useState('write');
  
  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const userResponse = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/user`
    );
    const userData = await userResponse.json();
    console.log("ログインユーザー情報:", userData);
  }

  const renderContent = () => {
    switch (currentPage) {
      case 'write':
        return <WritePage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'schedule':
        return <SchedulePage />;
      case 'premium':
        return <PremiumPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <WritePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        showSidebar={showSidebar} 
        setShowSidebar={setShowSidebar}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      <div className={`flex-1 ${showSidebar ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        <main>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
