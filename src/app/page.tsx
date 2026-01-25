"use client";

import { AuthGuard } from "@/components/AuthGuard";

export default function Home() {
  return (
    <AuthGuard>
      <div>You are logged in</div>
    </AuthGuard>
  );
}