"use client";

import { useState } from "react";
// import { useRouter } from "next/navigation";
import AccountSettingsPage from "./components/AccountSettings";
import TemplatesPage from "./components/Templates";
import SchedulePage from "./components/Schedule";
import AnalyticsPage from "./components/Analytics";
import SettingsPage from "./components/Settings";
import PostedPostsPage from "./components/PostedPosts";
import Sidebar from "./components/Sidebar";

export default function Home() {
  // const router = useRouter();
  const [showSidebar, setShowSidebar] = useState(true);
  const [currentPage, setCurrentPage] = useState("persona");

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     const response = await fetch('/api/user');
  //     const data = await response.json();
      
  //     if (!data.accessToken || !data.accessSecret) {
  //       router.push('/login');
  //     }
  //   };

  //   checkAuth();
  // }, [router]);

  const renderContent = () => {
    switch (currentPage) {
      case "persona":
        return <AccountSettingsPage />;
      case "templates":
        return <TemplatesPage />;
      case "schedule":
        return <SchedulePage />;
      case "posted":
        return <PostedPostsPage />;
      case "analytics":
        return <AnalyticsPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <AccountSettingsPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        // showSidebar={showSidebar}
        // setShowSidebar={setShowSidebar}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      <div
        className={`flex-1 ml-16`}
      >
        <main className="h-full">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
