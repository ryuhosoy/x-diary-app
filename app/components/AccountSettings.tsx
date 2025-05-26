'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Bell } from 'lucide-react';
import NotificationsDropdown from './NotificationsDropdown';
import { useUser } from '../context/UserContext';
import { supabase } from '@/app/utils/supabase';

export default function AccountSettingsPage() {
  const [accountSettings, setAccountSettings] = useState({
    name: '',
    description: '',
    targetAudience: '',
    expertise: '',
    tone: '',
    topics: ''
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const { userId } = useUser();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // 初期状態のチェック
    checkUnreadNotifications();

    // リアルタイムリスナーの設定
    const changes = supabase
      .channel("posted_posts")
      .on(
        "postgres_changes",
        {
          schema: "public",
          event: "*",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log("投稿の変更が検出されました:", payload);
          checkUnreadNotifications(); // 変更があったら未読状態を再チェック
        }
      )
      .subscribe();

    return () => {
      changes.unsubscribe();
    };
  }, [userId]);

  const checkUnreadNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from("posted_posts")
        .select("is_read_in_notifications")
        .eq("is_read_in_notifications", false)
        .eq('user_id', userId);

      if (error) throw error;

      setHasUnreadNotifications(data && data.length > 0);
    } catch (error) {
      console.error("未読通知のチェック中にエラーが発生しました:", error);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!accountSettings.name.trim()) {
      newErrors.name = 'Account Character is required';
    }
    if (!accountSettings.targetAudience.trim()) {
      newErrors.targetAudience = 'Target Audience is required';
    }
    if (!accountSettings.expertise.trim()) {
      newErrors.expertise = 'Expertise is required';
    }
    if (!accountSettings.tone.trim()) {
      newErrors.tone = 'Posting Style is required';
    }
    if (!accountSettings.description.trim()) {
      newErrors.description = 'Account Description is required';
    }
    if (!accountSettings.topics.trim()) {
      newErrors.topics = 'Post Topics is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setIsSuccess(false);

    console.log("accountSettings", accountSettings);

    try {
      const response = await fetch('/api/supabase/accountSettings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(accountSettings),
      });

      console.log("settings response", response);

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }
      setIsSuccess(true);
      // 設定成功後に入力欄をリセット
      setAccountSettings({
        name: '',
        description: '',
        targetAudience: '',
        expertise: '',
        tone: '',
        topics: ''
      });
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 p-8">
      <div className="w-full">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-center">Account Settings</h1>
          <div className="relative">
            <button 
              className="p-2 relative hover:bg-gray-100 rounded-full"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={24} />
              {hasUnreadNotifications && (
                <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              )}
            </button>
            <NotificationsDropdown 
              isOpen={showNotifications} 
              onClose={() => setShowNotifications(false)} 
              userId={userId || ''}
            />
          </div>
        </div>
        {isSuccess && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md text-center">
            Account settings have been saved successfully!
          </div>
        )}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Basic Account Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Account Character *</Label>
                  <Input
                    id="name"
                    value={accountSettings.name}
                    onChange={(e) => setAccountSettings({ ...accountSettings, name: e.target.value })}
                    placeholder="e.g., Programming Learning Journey"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Target Audience *</Label>
                  <Input
                    id="targetAudience"
                    value={accountSettings.targetAudience}
                    onChange={(e) => setAccountSettings({ ...accountSettings, targetAudience: e.target.value })}
                    placeholder="e.g., Programming Beginners, 20s Engineers"
                    className={errors.targetAudience ? 'border-red-500' : ''}
                  />
                  {errors.targetAudience && <p className="text-sm text-red-500">{errors.targetAudience}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expertise">Expertise *</Label>
                  <Input
                    id="expertise"
                    value={accountSettings.expertise}
                    onChange={(e) => setAccountSettings({ ...accountSettings, expertise: e.target.value })}
                    placeholder="e.g., Web Development, AI, Cloud Technology"
                    className={errors.expertise ? 'border-red-500' : ''}
                  />
                  {errors.expertise && <p className="text-sm text-red-500">{errors.expertise}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tone">Posting Style *</Label>
                  <Input
                    id="tone"
                    value={accountSettings.tone}
                    onChange={(e) => setAccountSettings({ ...accountSettings, tone: e.target.value })}
                    placeholder="e.g., Friendly, Professional and Polite"
                    className={errors.tone ? 'border-red-500' : ''}
                  />
                  {errors.tone && <p className="text-sm text-red-500">{errors.tone}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Account Description *</Label>
                <Textarea
                  id="description"
                  value={accountSettings.description}
                  onChange={(e) => setAccountSettings({ ...accountSettings, description: e.target.value })}
                  placeholder="Describe your account's background, values, and goals"
                  rows={4}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="topics">Post Topics *</Label>
                <Textarea
                  id="topics"
                  value={accountSettings.topics}
                  onChange={(e) => setAccountSettings({ ...accountSettings, topics: e.target.value })}
                  placeholder="Enter post topics separated by commas"
                  rows={3}
                  className={errors.topics ? 'border-red-500' : ''}
                />
                {errors.topics && <p className="text-sm text-red-500">{errors.topics}</p>}
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save Settings'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 