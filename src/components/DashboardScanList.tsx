"use client";

import Link from "next/link";
import { Copy, ExternalLink, CheckCircle, Loader2, XCircle } from "lucide-react";

type ScanItem = {
  id: string;
  url: string;
  status: "PENDING" | "RUNNING" | "COMPLETE" | "FAILED";
  createdAt: string;
};

const statusConfig = {
  COMPLETE: {
    label: "Completed",
    icon: CheckCircle,
    className: "bg-emerald-400/15 text-emerald-300",
  },
  RUNNING: {
    label: "Running",
    icon: Loader2,
    className: "bg-sky-400/15 text-sky-300",
  },
  PENDING: {
    label: "Pending",
    icon: Loader2,
    className: "bg-amber-400/15 text-amber-300",
  },
  FAILED: {
    label: "Failed",
    icon: XCircle,
    className: "bg-rose-400/15 text-rose-300",
  },
} as const;

export default function DashboardScanList({ scans }: { scans: ScanItem[] }) {
  if (scans.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-white/70 backdrop-blur">
        No scans yet.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {scans.map((scan) => {
        const status = statusConfig[scan.status] ?? statusConfig.PENDING;
        const StatusIcon = status.icon;

        return (
          <div key={scan.id}>
            <div
              className="group relative block rounded-2xl border border-white/10 bg-white/5 p-5 transition
                hover:-translate-y-0.5 hover:border-emerald-400/50"
            >
              <div className="flex min-w-0 items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm text-white/50">{scan.createdAt}</p>
                  <p className="mt-1 truncate text-lg font-semibold" title={scan.url}>
                    {scan.url}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(scan.url);
                      }}
                      className="rounded-lg bg-white/10 p-2 hover:bg-white/20"
                      title="Copy URL"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <a
                      href={scan.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="rounded-lg bg-white/10 p-2 hover:bg-white/20"
                      title="Open URL"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                  <span
                    className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs uppercase tracking-wide ${status.className}`}
                  >
                    <StatusIcon
                      className={`h-3.5 w-3.5 ${scan.status === "PENDING" ? "animate-spin" : ""}`}
                    />
                    {status.label}
                  </span>
                </div>
              </div>
              <Link
                href={`/scan/${scan.id}`}
                className="absolute inset-0 rounded-2xl"
                aria-label={`View scan for ${scan.url}`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
