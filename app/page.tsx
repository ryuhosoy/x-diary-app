"use client";

import { useEffect, useState } from "react";
import AccountSettingsPage from "./components/AccountSettings";
import TemplatesPage from "./components/Templates";
import SchedulePage from "./components/Schedule";
import AnalyticsPage from "./components/Analytics";
import SettingsPage from "./components/Settings";
import PostedPostsPage from "./components/PostedPosts";
import Sidebar from "./components/Sidebar";

export default function Home() {
  const [showSidebar, setShowSidebar] = useState(true);
  const [currentPage, setCurrentPage] = useState("persona");

  // const { userId, username, clearUserInfo } = useUser();

  // useEffect(() => {
  //   getUser();
  // }, []);

  // const getUser = async () => {
  //   const userResponse = await fetch(
  //     `${process.env.NEXT_PUBLIC_APP_URL}/api/user`
  //   );
  //   const userData = await userResponse.json();
  //   console.log("ログインユーザー情報:", userData);
  // };

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
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      <div
        className={`flex-1 ${
          showSidebar ? "ml-64" : "ml-20"
        } transition-all duration-300`}
      >
        <main className="h-full">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
