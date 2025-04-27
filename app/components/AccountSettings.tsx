'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function AccountSettingsPage() {
  const [accountSettings, setAccountSettings] = useState({
    name: '',
    description: '',
    targetAudience: '',
    expertise: '',
    tone: '',
    topics: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!accountSettings.name.trim()) {
      newErrors.name = 'Account Characterは必須です';
    }
    if (!accountSettings.targetAudience.trim()) {
      newErrors.targetAudience = 'Target Audienceは必須です';
    }
    if (!accountSettings.expertise.trim()) {
      newErrors.expertise = 'Expertiseは必須です';
    }
    if (!accountSettings.tone.trim()) {
      newErrors.tone = 'Posting Styleは必須です';
    }
    if (!accountSettings.description.trim()) {
      newErrors.description = 'Account Descriptionは必須です';
    }
    if (!accountSettings.topics.trim()) {
      newErrors.topics = 'Post Topicsは必須です';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('必須項目を入力してください');
      return;
    }

    try {
      const response = await fetch('/api/supabase/account-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(accountSettings),
      });

      if (!response.ok) {
        throw new Error('設定の保存に失敗しました');
      }

      toast.success('設定を保存しました');
    } catch (error) {
      toast.error('エラーが発生しました');
      console.error('Error saving settings:', error);
    }
  };

  return (
    <div className="flex-1 p-8">
      <div className="w-full">
        <h1 className="text-2xl font-bold mb-8 text-center">Account Settings</h1>
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

              <Button type="submit" className="w-full">
                Save Settings
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 