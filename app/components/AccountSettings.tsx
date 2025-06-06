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

// シンプルなモーダルコンポーネント
function Dialog({ open, onClose, title, children }: { open: boolean, onClose: () => void, title: string, children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={onClose}
          aria-label="閉じる"
        >
          ×
        </button>
        <div className="mb-4 font-bold text-lg">{title}</div>
        {children}
      </div>
    </div>
  );
}

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
  const [showTestModal, setShowTestModal] = useState(false);
  const [testPost, setTestPost] = useState('');
  const [isGeneratingTest, setIsGeneratingTest] = useState(false);

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

  const generateTestPost = async () => {
    if (!validateForm()) {
      return;
    }

    setIsGeneratingTest(true);
    try {
      const response = await fetch('/api/generate-test-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(accountSettings),
      });

      if (!response.ok) {
        throw new Error('Failed to generate test post');
      }

      const data = await response.json();
      setTestPost(data.post);
      setShowTestModal(true);
    } catch (error) {
      console.error('Error generating test post:', error);
    } finally {
      setIsGeneratingTest(false);
    }
  };

  return (
    <div className="flex-1 px-8 py-4 sm:px-12 sm:py-6 md:px-16 md:py-8">
      <div className="w-full">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-center sm:text-left">Account Settings</h1>
          <div className="relative">
            <button 
              className="p-2 relative hover:bg-gray-100 rounded-full transition-colors"
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
          <div className="mb-6 p-3 sm:p-4 bg-green-100 text-green-700 rounded-md text-center text-sm sm:text-base">
            Account settings have been saved successfully!
          </div>
        )}
        <Card className="w-full">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg sm:text-xl">Basic Account Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm sm:text-base">Account Character *</Label>
                  <Input
                    id="name"
                    value={accountSettings.name}
                    onChange={(e) => setAccountSettings({ ...accountSettings, name: e.target.value })}
                    placeholder="e.g., Programming Learning Journey"
                    className={`text-sm sm:text-base ${errors.name ? 'border-red-500' : ''}`}
                  />
                  {errors.name && <p className="text-xs sm:text-sm text-red-500">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetAudience" className="text-sm sm:text-base">Target Audience *</Label>
                  <Input
                    id="targetAudience"
                    value={accountSettings.targetAudience}
                    onChange={(e) => setAccountSettings({ ...accountSettings, targetAudience: e.target.value })}
                    placeholder="e.g., Programming Beginners, 20s Engineers"
                    className={`text-sm sm:text-base ${errors.targetAudience ? 'border-red-500' : ''}`}
                  />
                  {errors.targetAudience && <p className="text-xs sm:text-sm text-red-500">{errors.targetAudience}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expertise" className="text-sm sm:text-base">Expertise *</Label>
                  <Input
                    id="expertise"
                    value={accountSettings.expertise}
                    onChange={(e) => setAccountSettings({ ...accountSettings, expertise: e.target.value })}
                    placeholder="e.g., Web Development, AI, Cloud Technology"
                    className={`text-sm sm:text-base ${errors.expertise ? 'border-red-500' : ''}`}
                  />
                  {errors.expertise && <p className="text-xs sm:text-sm text-red-500">{errors.expertise}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tone" className="text-sm sm:text-base">Posting Style *</Label>
                  <Input
                    id="tone"
                    value={accountSettings.tone}
                    onChange={(e) => setAccountSettings({ ...accountSettings, tone: e.target.value })}
                    placeholder="e.g., Friendly, Professional and Polite"
                    className={`text-sm sm:text-base ${errors.tone ? 'border-red-500' : ''}`}
                  />
                  {errors.tone && <p className="text-xs sm:text-sm text-red-500">{errors.tone}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm sm:text-base">Account Description *</Label>
                <Textarea
                  id="description"
                  value={accountSettings.description}
                  onChange={(e) => setAccountSettings({ ...accountSettings, description: e.target.value })}
                  placeholder="Describe your account's background, values, and goals"
                  rows={4}
                  className={`text-sm sm:text-base ${errors.description ? 'border-red-500' : ''}`}
                />
                {errors.description && <p className="text-xs sm:text-sm text-red-500">{errors.description}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="topics" className="text-sm sm:text-base">Post Topics *</Label>
                <Textarea
                  id="topics"
                  value={accountSettings.topics}
                  onChange={(e) => setAccountSettings({ ...accountSettings, topics: e.target.value })}
                  placeholder="Enter post topics separated by commas"
                  rows={3}
                  className={`text-sm sm:text-base ${errors.topics ? 'border-red-500' : ''}`}
                />
                {errors.topics && <p className="text-xs sm:text-sm text-red-500">{errors.topics}</p>}
              </div>

              <div className="flex gap-4">
                <Button 
                  type="button"
                  variant="outline"
                  className="w-full text-sm sm:text-base py-2 sm:py-3"
                  onClick={generateTestPost}
                  disabled={isGeneratingTest}
                >
                  {isGeneratingTest ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-4 w-4 sm:h-5 sm:w-5"
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
                      Generating...
                    </>
                  ) : (
                    'Generate Test Post'
                  )}
                </Button>
                <Button 
                  type="submit" 
                  className="w-full text-sm sm:text-base py-2 sm:py-3" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white"
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
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showTestModal} onClose={() => setShowTestModal(false)} title="Test Post">
        <div className="mt-2 p-2 bg-gray-50 rounded-lg">
          <p className="whitespace-pre-wrap">{testPost}</p>
        </div>
      </Dialog>
    </div>
  );
} 