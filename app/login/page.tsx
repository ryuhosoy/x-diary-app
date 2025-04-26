"use client";
import { Suspense } from 'react';
import { X } from "lucide-react";
import Link from "next/link";

// SearchParamsを使用するコンポーネントを分離
function LoginContent() {
  const handleLogin = async () => {
    try {
      const response = await fetch('/api/auth/twitter');
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('ログインエラー:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-100 flex items-center justify-center p-4 sm:p-8">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="mb-5 transform transition-transform hover:scale-105">
            <X size={42} className="text-blue-600 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-900">Welcome to X Diary</h2>
          <p className="text-gray-600 text-sm">
            Log in to manage your social media presence
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-4 transform transition-all hover:shadow-md">
          <div>
            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-[1.01] font-medium text-sm flex items-center justify-center space-x-2 max-w-xs mx-auto"
            >
              <X size={16} />
              <span>Log In with X</span>
            </button>
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-gray-500 text-xs">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// メインのページコンポーネント
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
    </div>}>
      <LoginContent />
    </Suspense>
  );
}
