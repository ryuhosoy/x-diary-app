"use client";
import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { X } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter()

//   useEffect(() => {
//     // ログイン済みの場合はTOPページにリダイレクト
//     if (status === "authenticated") {
//       redirect("/");
//     }
//   }, [session, status]);

  useEffect(() => {
    // ログイン済みの場合はTOPページにリダイレクト
    if (status === "authenticated") {
      router.push("/");
    }
  }, []);

  const handleLogin = (provider: string) => async (event: React.MouseEvent) => {
    event.preventDefault();
    const result = await signIn(provider);
    console.log("handleLogin result", result);

    if (result) {
      router.push("/");
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
          <div>
            <button
              onClick={handleLogin("twitter")}
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
