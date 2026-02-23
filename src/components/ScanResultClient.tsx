"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import { API_URL } from "@/lib/api";

type Issue = {
  id: string;
  title: string;
  category: string;
  severity: string;
  why: string;
  how: string;
  code?: string | null;
  impact: string;
};

type ScanResponse = {
  id: string;
  url: string;
  status: string;
  summary: {
    scores: {
      speed: number | null;
      seo: number | null;
      accessibility: number | null;
      bestPractices: number | null;
    };
    webVitals: Record<string, { percentile: number; category: string }>;
  } | null;
  issues: Issue[];
  plan?: string;
  isLimited?: boolean;
  hiddenCount?: number;
};

const formatScore = (score: number | null) => (score === null ? "-" : `${score}`);

export default function ScanResultClient({ scanId }: { scanId: string }) {
  const [scan, setScan] = useState<ScanResponse | null>(null);
  const [status, setStatus] = useState("PENDING");
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const start = Date.now();
    const fetchScan = async () => {
      const response = await fetch(`${API_URL}/scans/${scanId}`, {
        credentials: "include",
      });
      if (!response.ok) return;
      const data = (await response.json()) as ScanResponse;
      setScan(data);
      setStatus(data.status);
      if (data.status === "PENDING" || data.status === "RUNNING") {
        if (Date.now() - start > 60000) {
          setStuck(true);
        }
        timer = setTimeout(fetchScan, 4000);
      }
    };
    fetchScan();
    return () => clearTimeout(timer);
  }, [scanId]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-400 text-slate-900">
              F
            </span>
            <span>FixSpeed</span>
          </Link>
          <div className="flex items-center gap-3 text-sm text-white/70">
            <Link href="/pricing">Pricing</Link>
            <Link href="/dashboard">Dashboard</Link>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-6 pb-12">
        <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <p className="text-xs uppercase tracking-widest text-white/50">Scan</p>
          {/* Updated h1 with truncation */}
          <h1 className="truncate max-w-full text-2xl font-semibold" title={scan?.url}>
              {scan?.url ?? "Scanning..."}
          </h1>
          <div className="flex flex-wrap gap-3 text-xs uppercase tracking-wide text-white/60">
            <span className="rounded-full border border-white/10 px-3 py-1">{status}</span>
            {status === "COMPLETE" && scan?.plan !== "free" && (
              <a
                href={`${API_URL}/scans/${scanId}/report`}
                className="rounded-full border border-emerald-400/50 px-3 py-1 text-emerald-300"
              >
                Export PDF
              </a>
            )}
          </div>
        </div>

        {scan?.isLimited && (
          <div className="mt-6 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-5 text-sm text-emerald-100">
            You are on the Free plan. Showing the top 4 issues only.
            {scan.hiddenCount ? ` ${scan.hiddenCount} more fixes are available with Pro.` : ""}{" "}
            <Link className="underline" href="/pricing">
              Upgrade to unlock full fixes.
            </Link>
          </div>
        )}

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-white/50">Speed</p>
            <p className="mt-2 text-2xl font-semibold">{formatScore(scan?.summary?.scores.speed ?? null)}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-white/50">SEO</p>
            <p className="mt-2 text-2xl font-semibold">{formatScore(scan?.summary?.scores.seo ?? null)}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-white/50">Accessibility</p>
            <p className="mt-2 text-2xl font-semibold">
              {formatScore(scan?.summary?.scores.accessibility ?? null)}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-white/50">Best Practices</p>
            <p className="mt-2 text-2xl font-semibold">
              {formatScore(scan?.summary?.scores.bestPractices ?? null)}
            </p>
          </div>
        </div>

        <div className="mt-10 space-y-6">
          {(scan?.issues?.length ?? 0) === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-white/60 backdrop-blur">
              {status === "FAILED"
                ? "We could not complete the scan. Try again in a minute."
                : status === "COMPLETE"
                ? "No major issues found."
                : stuck
                ? "This scan is taking a while."
                : "Analyzing issues..."}
            </div>
          ) : (
            scan?.issues.map((issue) => (
              <div key={issue.id} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-xl font-semibold">{issue.title}</h2>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-wide text-white/60">
                    {issue.category} - {issue.severity}
                  </span>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-emerald-300">Why this matters</p>
                    <p className="mt-2 text-sm text-white/80">{issue.why}</p>
                  </div>
                  <div>
                    <p className="text-sm text-emerald-300">Expected improvement</p>
                    <p className="mt-2 text-sm text-white/80">{issue.impact}</p>
                  </div>
                  <div>
                    <p className="text-sm text-emerald-300">How to fix it</p>
                    <p className="mt-2 text-sm text-white/80">{issue.how}</p>
                  </div>
                  <div>
                    <p className="text-sm text-emerald-300">Code example</p>
                    <pre className="mt-2 rounded-xl bg-slate-900 p-4 text-xs text-white/80">
                      {issue.code ?? "No code example required."}
                    </pre>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {scan?.isLimited && status === "COMPLETE" && (
          <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
            <h3 className="text-2xl font-semibold">Unlock the full fix list</h3>
            <p className="mt-2 text-sm text-white/70">
              Pro shows every issue, full code examples, and PDF exports.
            </p>
            <Link
              href="/pricing"
              className="mt-6 inline-flex rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-900"
            >
              Upgrade to Pro
            </Link>
          </div>
        )}
      </div>
      <SiteFooter />
    </div>
  );
}