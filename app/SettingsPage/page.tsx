"use client";

import React, { useState } from 'react';
import { Bell, Globe, Lock, User, Moon, Sun, Trash2 } from 'lucide-react';

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="flex-1 p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-8">Settings</h2>

        {/* Account Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center mb-6">
            <User className="text-gray-600 mr-2" size={20} />
            <h3 className="text-lg font-semibold">Account Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Name
              </label>
              <input
                type="text"
                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                placeholder="Your display name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                X (Twitter) Username
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                  @
                </span>
                <input
                  type="text"
                  className="flex-1 rounded-none rounded-r-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                  placeholder="username"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center mb-6">
            <Bell className="text-gray-600 mr-2" size={20} />
            <h3 className="text-lg font-semibold">Notification Settings</h3>
          </div>

          <div className="space-y-4">
            {[
              { label: 'Post Published Notifications', description: 'Get notified when your scheduled posts are published' },
              { label: 'Engagement Notifications', description: 'Get notified about likes, retweets, and mentions' },
              { label: 'Analytics Reports', description: 'Receive weekly analytics reports' },
              { label: 'Email Notifications', description: 'Receive notifications via email' }
            ].map((setting, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{setting.label}</h4>
                  <p className="text-sm text-gray-600">{setting.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center mb-6">
            {darkMode ? (
              <Moon className="text-gray-600 mr-2" size={20} />
            ) : (
              <Sun className="text-gray-600 mr-2" size={20} />
            )}
            <h3 className="text-lg font-semibold">Appearance</h3>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Dark Mode</h4>
              <p className="text-sm text-gray-600">Switch between light and dark themes</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        {/* Language Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center mb-6">
            <Globe className="text-gray-600 mr-2" size={20} />
            <h3 className="text-lg font-semibold">Language & Region</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200">
                <option value="en">English</option>
                <option value="ja">日本語</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Zone
              </label>
              <select className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200">
                <option value="Asia/Tokyo">Tokyo (GMT+9)</option>
                <option value="America/Los_Angeles">Pacific Time (GMT-8)</option>
                <option value="America/New_York">Eastern Time (GMT-5)</option>
                <option value="Europe/London">London (GMT+0)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center mb-6">
            <Lock className="text-gray-600 mr-2" size={20} />
            <h3 className="text-lg font-semibold">Security</h3>
          </div>

          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50">
              <div>
                <h4 className="font-medium">Change Password</h4>
                <p className="text-sm text-gray-600">Update your account password</p>
              </div>
              <span className="text-blue-600">→</span>
            </button>

            <button className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50">
              <div>
                <h4 className="font-medium">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-600">Add an extra layer of security</p>
              </div>
              <span className="text-blue-600">→</span>
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-xl border border-red-200 p-6">
          <div className="flex items-center mb-6">
            <Trash2 className="text-red-600 mr-2" size={20} />
            <h3 className="text-lg font-semibold text-red-600">Danger Zone</h3>
          </div>

          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-4 rounded-lg border border-red-200 hover:bg-red-50">
              <div>
                <h4 className="font-medium text-red-600">Delete Account</h4>
                <p className="text-sm text-red-600">Permanently delete your account and all data</p>
              </div>
              <Trash2 className="text-red-600" size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}