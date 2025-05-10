'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface Template {
  id: string;
  title: string;
  content: string;
  category: string;
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [newTemplate, setNewTemplate] = useState({
    title: '',
    content: '',
    category: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const template: Template = {
      id: Date.now().toString(),
      ...newTemplate
    };
    setTemplates([...templates, template]);
    setNewTemplate({ title: '', content: '', category: '' });
  };

  return (
    <div className="flex-1 p-8">
      <div className="w-full">
        <h1 className="text-2xl font-bold mb-8 text-center">Post Templates</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create New Template</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Template Name</Label>
                <Input
                  id="title"
                  value={newTemplate.title}
                  onChange={(e) => setNewTemplate({ ...newTemplate, title: e.target.value })}
                  placeholder="e.g., Tech Information Share"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={newTemplate.category}
                  onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                  placeholder="e.g., Tech News, Tips, Updates"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Template Content</Label>
                <Textarea
                  id="content"
                  value={newTemplate.content}
                  onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
                  placeholder="Enter post template. Use {variable} format to set variables."
                  rows={6}
                />
              </div>

              <Button type="submit" className="w-full">
                Save Template
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Saved Templates</h2>
          {templates.map((template) => (
            <Card key={template.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{template.title}</span>
                  <span className="text-sm text-gray-500">{template.category}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{template.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 