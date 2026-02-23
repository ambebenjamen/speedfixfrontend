"use client";

import Link from "next/link";
import { useAuth } from "@/lib/useAuth";

export default function AuthButtons() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return <span className="text-sm text-white/60">Loading...</span>;
  }

  if (!user) {
    return (
      <Link
        href="/signin"
        className="rounded-full border border-white/15 px-4 py-2 text-sm text-white"
      >
        Sign in
      </Link>
    );
  }

  return (
    <button
      onClick={() => logout()}
      className="rounded-full border border-white/15 px-4 py-2 text-sm text-white"
    >
      Log out
    </button>
  );
}
