"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { apiFetch } from "@/lib/api";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    description: "Try one scan per day with core fixes.",
    features: ["1 scan/day", "Top issues and fixes", "7-day scan history"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$19",
    description: "For founders shipping fast.",
    features: ["50 scans/month", "PDF exports", "90-day history"],
  },
  {
    id: "agency",
    name: "Agency",
    price: "$79",
    description: "For client work and reporting.",
    features: ["300 scans/month", "Branded reports", "Team seats (3)"],
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const startCheckout = async (plan: "pro" | "agency") => {
    setLoading(plan);
    const response = await apiFetch("/stripe/checkout", {
      method: "POST",
      body: JSON.stringify({ plan }),
    });
    const data = await response.json();
    if (data?.url) {
      router.push(data.url);
    }
    setLoading(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
          <p className="text-xs uppercase tracking-widest text-emerald-300">Pricing</p>
          <h1 className="mt-3 text-4xl font-semibold md:text-5xl">Simple pricing</h1>
          <p className="mt-3 text-white/70">
            Pay for fixes and clarity, not dashboards.
          </p>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:-translate-y-1 hover:border-emerald-400/40"
            >
              <p className="text-sm uppercase tracking-wide text-white/60">{plan.name}</p>
              <p className="mt-3 text-3xl font-semibold">{plan.price}</p>
              <p className="mt-2 text-sm text-white/60">{plan.description}</p>
              <ul className="mt-6 space-y-2 text-sm text-white/80">
                {plan.features.map((feature) => (
                  <li key={feature}>- {feature}</li>
                ))}
              </ul>
              {plan.id !== "free" && (
                <button
                  onClick={() => startCheckout(plan.id as "pro" | "agency")}
                  disabled={loading === plan.id}
                  className="mt-6 w-full rounded-full bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-900"
                >
                  {loading === plan.id ? "Redirecting..." : "Upgrade"}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
