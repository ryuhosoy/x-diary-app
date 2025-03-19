import React from 'react';
import { BarChart2, TrendingUp, Users, Activity } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="flex-1 p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-8">Analytics Dashboard</h2>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Posts</p>
                <h3 className="text-2xl font-bold mt-1">1,234</h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <BarChart2 className="text-blue-600" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-500">↑ 12%</span>
              <span className="text-gray-600 ml-2">vs last month</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Engagement Rate</p>
                <h3 className="text-2xl font-bold mt-1">4.6%</h3>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Activity className="text-purple-600" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-500">↑ 8%</span>
              <span className="text-gray-600 ml-2">vs last month</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Followers</p>
                <h3 className="text-2xl font-bold mt-1">45.2K</h3>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Users className="text-green-600" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-500">↑ 15%</span>
              <span className="text-gray-600 ml-2">vs last month</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Impressions</p>
                <h3 className="text-2xl font-bold mt-1">1.2M</h3>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <TrendingUp className="text-orange-600" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-500">↑ 24%</span>
              <span className="text-gray-600 ml-2">vs last month</span>
            </div>
          </div>
        </div>

        {/* Best Performing Posts */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Best Performing Posts</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((post) => (
              <div key={post} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Posted on March 15, 2024</span>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="flex items-center">
                      <span className="mr-2">❤️</span>
                      1.2K
                    </span>
                    <span className="flex items-center">
                      <span className="mr-2">🔁</span>
                      458
                    </span>
                    <span className="flex items-center">
                      <span className="mr-2">👁️</span>
                      24.5K
                    </span>
                  </div>
                </div>
                <p className="text-gray-800">Just launched our new feature! The response has been overwhelming. Thank you to everyone who's been part of this journey! #Tech #Innovation</p>
              </div>
            ))}
          </div>
        </div>

        {/* Engagement Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Engagement Over Time</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            Chart placeholder - Integration with a chart library would go here
          </div>
        </div>
      </div>
    </div>
  );
}