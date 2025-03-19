"use client";

import { useState } from "react";
import Link from "next/link";
import WritePage from "./WritePage/page";
import { Sidebar } from "./components/Sidebar";

export default function Home() {
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <div className={`flex-1 ${showSidebar ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        <main>
          <WritePage />
          <Link href="/AnalyticsPage"></Link>
          <Link href="/SchedulePage"></Link>
          <Link href="/PremiumPage"></Link>
          <Link href="/SettingsPage"></Link>
        </main>
      </div>
    </div>
  );
}
