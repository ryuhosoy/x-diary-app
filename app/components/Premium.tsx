'use client'
import React from 'react';
import { Star, Zap, Trophy, Crown } from 'lucide-react';

export default function PremiumPage() {
  return (
    <div className="flex-1 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Upgrade to Premium</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get access to advanced features and unlock the full potential of your social media presence
          </p>
        </div>

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Basic Plan */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="text-center mb-6">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="text-blue-600" size={24} />
              </div>
              <h3 className="text-xl font-bold">Basic</h3>
              <div className="mt-4">
                <span className="text-3xl font-bold">$9</span>
                <span className="text-gray-600">/month</span>
              </div>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center">
                <Zap className="text-blue-600 mr-2" size={16} />
                <span>Up to 5 scheduled posts</span>
              </li>
              <li className="flex items-center">
                <Zap className="text-blue-600 mr-2" size={16} />
                <span>Basic analytics</span>
              </li>
              <li className="flex items-center">
                <Zap className="text-blue-600 mr-2" size={16} />
                <span>Standard AI assistance</span>
              </li>
            </ul>
            <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Get Started
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-blue-50 rounded-xl border-2 border-blue-600 p-6 transform scale-105">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm">
                Most Popular
              </span>
            </div>
            <div className="text-center mb-6">
              <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold">Pro</h3>
              <div className="mt-4">
                <span className="text-3xl font-bold">$19</span>
                <span className="text-gray-600">/month</span>
              </div>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center">
                <Zap className="text-blue-600 mr-2" size={16} />
                <span>Unlimited scheduled posts</span>
              </li>
              <li className="flex items-center">
                <Zap className="text-blue-600 mr-2" size={16} />
                <span>Advanced analytics</span>
              </li>
              <li className="flex items-center">
                <Zap className="text-blue-600 mr-2" size={16} />
                <span>Premium AI assistance</span>
              </li>
              <li className="flex items-center">
                <Zap className="text-blue-600 mr-2" size={16} />
                <span>Viral post optimization</span>
              </li>
            </ul>
            <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Upgrade Now
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="text-center mb-6">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="text-purple-600" size={24} />
              </div>
              <h3 className="text-xl font-bold">Enterprise</h3>
              <div className="mt-4">
                <span className="text-3xl font-bold">$49</span>
                <span className="text-gray-600">/month</span>
              </div>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center">
                <Zap className="text-purple-600 mr-2" size={16} />
                <span>All Pro features</span>
              </li>
              <li className="flex items-center">
                <Zap className="text-purple-600 mr-2" size={16} />
                <span>Custom AI training</span>
              </li>
              <li className="flex items-center">
                <Zap className="text-purple-600 mr-2" size={16} />
                <span>Priority support</span>
              </li>
              <li className="flex items-center">
                <Zap className="text-purple-600 mr-2" size={16} />
                <span>Team collaboration</span>
              </li>
            </ul>
            <button className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
              Contact Sales
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <Star className="text-yellow-500" size={24} />,
              title: "AI-Powered Content",
              description: "Let our AI help you create engaging content that resonates with your audience"
            },
            {
              icon: <Trophy className="text-blue-500" size={24} />,
              title: "Viral Predictions",
              description: "Get insights into which posts are likely to go viral before you publish"
            },
            {
              icon: <Zap className="text-purple-500" size={24} />,
              title: "Smart Scheduling",
              description: "Automatically post at the best times for maximum engagement"
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="bg-gray-50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}