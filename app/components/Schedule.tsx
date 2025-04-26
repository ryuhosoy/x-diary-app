'use client'
import React from 'react';
import { Calendar, Edit3 } from 'lucide-react';

export default function SchedulePage() {
  return (
    <div className="flex-1 p-8">
      <div className="w-full">
        <h2 className="text-2xl font-bold mb-8 text-center">Post Schedule</h2>

        {/* Schedule Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Posts */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Upcoming Posts</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((post) => (
                  <div key={post} className="flex items-start space-x-4 border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Calendar className="text-blue-600" size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-medium">Scheduled Post #{post}</h4>
                          <p className="text-sm text-gray-600">Scheduled for March 20, 2024 at 10:00 AM</p>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700">
                          <Edit3 size={18} />
                        </button>
                      </div>
                      <p className="text-gray-800">Looking forward to sharing some exciting updates about our latest project! Stay tuned! #Development #Innovation</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Schedule Settings */}
          <div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Posting Schedule</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Posting Times
                  </label>
                  <div className="space-y-2">
                    {['Morning (9:00 AM)', 'Afternoon (2:00 PM)', 'Evening (7:00 PM)'].map((time) => (
                      <label key={time} className="flex items-center space-x-3">
                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <span className="text-gray-700">{time}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Posting Frequency
                  </label>
                  <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    <option>Once per day</option>
                    <option>Twice per day</option>
                    <option>Three times per day</option>
                    <option>Custom</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Zone
                  </label>
                  <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    <option>Tokyo (GMT+9)</option>
                    <option>Pacific Time (GMT-8)</option>
                    <option>Eastern Time (GMT-5)</option>
                  </select>
                </div>

                <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mt-4">
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}