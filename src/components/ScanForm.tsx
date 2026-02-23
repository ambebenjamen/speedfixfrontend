"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ScanPage() {
  const router = useRouter();

  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pasted, setPasted] = useState(false);

  const startScan = async () => {
    if (!url.trim()) return;

    setError("");
    setLoading(true);

    try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}/scans`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
        credentials: "include",
      }
    );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Unable to scan");
      }

      router.push(`/scan/${data.scanId}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-24">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          startScan();
        }}
        className="relative rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur shadow-[0_30px_120px_rgba(16,185,129,0.2)]"
      >
        <label className="text-xs uppercase tracking-widest text-white/50">
          Paste a URL
        </label>

        <div className="mt-3 flex min-w-0 flex-col gap-3 lg:flex-row">
          <div className="relative w-full min-w-0">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onPaste={() => {
                setPasted(true);
                setTimeout(() => setPasted(false), 600);
              }}
              placeholder="https://yourwebsite.com"
              title={url}
              className={`w-full min-w-0 rounded-xl border px-4 py-3 text-sm text-white placeholder:text-white/40
                bg-slate-950/60
                overflow-hidden whitespace-nowrap text-ellipsis
                focus:outline-none focus:ring-2 focus:ring-emerald-400/30
                transition-all duration-300
                ${
                  pasted
                    ? "border-emerald-400 ring-2 ring-emerald-400/40 animate-pulse"
                    : "border-white/10 focus:border-emerald-400/60"
                }`}
            />

            {/* Paste indicator */}
            {pasted && (
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-emerald-300 animate-fade-in">
                Pasted ✓
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || url.trim().length < 3}
            className="w-full lg:w-auto lg:shrink-0 rounded-xl bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-900 transition
              hover:-translate-y-0.5 hover:bg-emerald-300
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Scanning..." : "Run free scan"}
          </button>
        </div>

        {error ? (
          <p className="mt-3 text-sm text-rose-300">{error}</p>
        ) : (
          <p className="mt-3 text-xs text-white/50">
            Free scan includes speed, SEO, and accessibility checks.
          </p>
        )}
      </form>
    </div>
  );
}
