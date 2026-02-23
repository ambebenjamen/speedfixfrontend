"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { apiFetch } from "@/lib/api";

export default function AuthCallbackClient() {
  const params = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    const token = params.get("token");
    const email = params.get("email");
    if (!token || !email) {
      setError("Invalid sign-in link.");
      return;
    }

    const verify = async () => {
      const res = await apiFetch("/auth/verify", {
        method: "POST",
        body: JSON.stringify({ token, email }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error || "Sign-in link expired.");
        return;
      }
      router.replace("/dashboard");
    };

    verify();
  }, [params, router]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <SiteHeader />
      <div className="mx-auto flex min-h-[calc(100vh-160px)] max-w-3xl flex-col items-center justify-center px-6 text-center">
        <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
          <p className="text-xs uppercase tracking-widest text-emerald-300">
            Signing you in
          </p>
          <h1 className="mt-3 text-3xl font-semibold">Just a moment...</h1>
          <p className="mt-3 text-sm text-white/70">
            We are verifying your secure link.
          </p>
          {error ? (
            <div className="mt-6 rounded-2xl border border-rose-400/30 bg-rose-400/10 p-4 text-sm text-rose-200">
              {error}
            </div>
          ) : null}
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
