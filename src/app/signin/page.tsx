"use client";

import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <SiteHeader />
      <div className="mx-auto flex min-h-[calc(100vh-96px)] max-w-3xl flex-col items-center justify-center px-6">
        <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-8">
          <h1 className="text-2xl font-semibold">Sign in</h1>
          <p className="mt-2 text-sm text-white/70">
            Enter your email and we’ll send you a magic link.
          </p>
          {sentTo ? (
            <div className="mt-6 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-5 text-sm text-emerald-100">
              <p className="font-semibold">Check your email</p>
              <p className="mt-2 text-white/70">
                We sent a secure sign‑in link to <span className="text-white">{sentTo}</span>.
                Open it on this device to finish signing in.
              </p>
              <p className="mt-2 text-xs text-white/60">
                Didn’t get it? Check spam or wait a minute, then try again.
              </p>
              <button
                onClick={() => {
                  setSentTo(null);
                  setError("");
                }}
                className="mt-4 rounded-full border border-white/15 px-4 py-2 text-xs text-white"
              >
                Use a different email
              </button>
            </div>
          ) : (
            <form
            className="mt-6 space-y-4"
            onSubmit={async (event) => {
              event.preventDefault();
              setLoading(true);
              setError("");
              try {
                const res = await apiFetch("/auth/request", {
                  method: "POST",
                  body: JSON.stringify({ email }),
                });
                if (!res.ok) {
                  const data = await res.json().catch(() => null);
                  throw new Error(data?.error || "Unable to send email");
                }
                setSentTo(email);
                router.push("/check-email");
              } catch (err: unknown) {
                setError(
                  err instanceof Error
                    ? err.message
                    : "We couldn’t send the email. Try again in a moment."
                );
              } finally {
                setLoading(false);
              }
            }}
          >
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@company.com"
              className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white placeholder:text-white/40"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-emerald-400 px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-emerald-300"
            >
              {loading ? "Sending..." : "Send magic link"}
            </button>
            {error ? <p className="text-xs text-rose-300">{error}</p> : null}
          </form>
          )}
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
