'use client';
import React from 'react';
import { FileText, Calendar, MessageCircle, Heart, Share2 } from 'lucide-react';

export default function PostedPostsPage() {
  return (
    <div className="flex-1 p-8">
      <div className="w-full">
        <h2 className="text-2xl font-bold mb-8 text-center">Posted Posts</h2>
        
        <div className="space-y-6">
          {[1, 2, 3].map((post) => (
            <div key={post} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <FileText className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold">Post #{post}</h3>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar size={14} className="mr-1" />
                      <span>Posted on March {15 + post}, 2024</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-800 mb-4">
                This is an example of a posted tweet. It could contain any content that was previously posted to Twitter.
                The content might include text, images, or links to other resources.
              </p>
              
              <div className="flex items-center space-x-6 text-gray-600">
                <div className="flex items-center">
                  <MessageCircle size={16} className="mr-1" />
                  <span>128</span>
                </div>
                <div className="flex items-center">
                  <Heart size={16} className="mr-1" />
                  <span>1.2K</span>
                </div>
                <div className="flex items-center">
                  <Share2 size={16} className="mr-1" />
                  <span>458</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 