"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ProfileNameForm from "@/components/ProfileNameForm";
import DashboardScanList from "@/components/DashboardScanList";
import { apiFetch } from "@/lib/api";

type ScanItem = {
  id: string;
  url: string;
  status: "PENDING" | "RUNNING" | "COMPLETE" | "FAILED";
  createdAt: string;
};

export default function DashboardPage() {
  const [user, setUser] = useState<{ email: string; name?: string | null } | null>(null);
  const [scans, setScans] = useState<ScanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const ownerEmail = "lambibenjamen@gmail.com";

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const me = await apiFetch("/auth/me");
      if (!me.ok) {
        setUser(null);
        setLoading(false);
        return;
      }
      const meData = await me.json();
      setUser(meData);

      const scansRes = await apiFetch("/scans");
      if (scansRes.ok) {
        const items = (await scansRes.json()) as ScanItem[];
        setScans(
          items.map((scan) => ({
            ...scan,
            createdAt: new Date(scan.createdAt).toISOString(),
          }))
        );
      }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <SiteHeader />
        <div className="mx-auto flex min-h-[calc(100vh-160px)] max-w-4xl flex-col items-center justify-center px-6 text-center">
          <p className="text-white/60">Loading dashboard...</p>
        </div>
        <SiteFooter />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 text-center">
          <h1 className="text-3xl font-semibold">Sign in first</h1>
          <p className="mt-3 text-white/70">Save scan history and export reports.</p>
          <Link
            className="mt-6 rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-900"
            href="/signin"
          >
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  const displayName = user.name ?? user.email ?? "there";

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <SiteHeader />
      <div className="mx-auto max-w-5xl px-6 pb-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Welcome, {displayName}</h1>
            <p className="mt-2 text-sm text-white/70">Recent scans and results.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link className="rounded-full border border-white/15 px-4 py-2 text-sm" href="/">
              New scan
            </Link>
            <Link className="rounded-full border border-white/15 px-4 py-2 text-sm" href="/pricing">
              Upgrade
            </Link>
            {user.email === ownerEmail ? (
              <Link
                className="rounded-full border border-emerald-300/40 px-4 py-2 text-sm text-emerald-200"
                href="/dashboard/admin"
              >
                Admin
              </Link>
            ) : null}
          </div>
        </div>
        {!user.name && (
          <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <ProfileNameForm initialName={user.name} />
          </div>
        )}
        <div className="mt-8">
          <DashboardScanList scans={scans} />
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
