"use client";

import { AuthGuard } from "@/components/AuthGuard";

import { Footer } from "@/components/Footer";

function HomePage() {
  return (
    <div>
      <h1>Home</h1>
    </div>
  );
}

export default function Home() {
  return (
    <AuthGuard>
      <HomePage />
      <Footer />
    </AuthGuard>
  );
}
