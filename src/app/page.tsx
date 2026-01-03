"use client";

import { LoginButton } from "@/components/LoginButton";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full mx-auto p-6">
          <div className="flex flex-col items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My app</h1>
            <p className="text-gray-600">Yurim template</p>
          </div>
          <LoginButton />
        </div>
      </div>
    );
  }

  return <div>You are logged in</div>;
}
