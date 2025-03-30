"use client";
import { X } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/auth/twitter');
      const data = await response.json();
      
      // レスポンスからクッキーを取得
      const cookies = response.headers.get('set-cookie');
      if (cookies) {
        // クッキーを解析して保存
        const cookieParts = cookies.split(';');
        const oauthToken = cookieParts.find(part => part.trim().startsWith('oauth_token='));
        const oauthTokenSecret = cookieParts.find(part => part.trim().startsWith('oauth_token_secret='));
        
        if (oauthToken && oauthTokenSecret) {
          document.cookie = oauthToken;
          document.cookie = oauthTokenSecret;
        }
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('ログインエラー:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <X size={40} className="text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Welcome to X Diary</h2>
          <p className="text-gray-600">
            Log in to manage your social media presence
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {error === 'invalid_request' && '無効なリクエストです'}
              {error === 'auth_failed' && '認証に失敗しました'}
            </div>
          )}
          <div>
            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Log In with X
            </button>
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
