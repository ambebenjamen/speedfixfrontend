import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function CheckEmailPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <SiteHeader />
      <div className="mx-auto flex min-h-[calc(100vh-160px)] max-w-3xl flex-col items-center justify-center px-6 text-center">
        <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
          <p className="text-xs uppercase tracking-widest text-emerald-300">
            Check your inbox
          </p>
          <h1 className="mt-3 text-3xl font-semibold">We sent your sign‑in link</h1>
          <p className="mt-3 text-sm text-white/70">
            Open the email and click the secure link to continue. For best
            results, open it on the same device where you requested it.
          </p>
          <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/80 p-4 text-sm text-white/70">
            If you don’t see it, check spam or wait a minute and try again.
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
