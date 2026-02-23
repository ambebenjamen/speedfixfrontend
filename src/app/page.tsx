import ScanForm from "@/components/ScanForm";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 -z-10">
        <div className="h-full w-full bg-[radial-gradient(circle_at_top,#0f172a,#0a0c12_55%)]" />
        <div className="absolute left-[15%] top-24 h-64 w-64 rounded-full bg-emerald-500/25 blur-[140px]" />
        <div className="absolute right-[10%] top-40 h-72 w-72 rounded-full bg-sky-500/20 blur-[160px]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[48px_48px] opacity-30" />
      </div>

      <SiteHeader />

      <main className="mx-auto max-w-6xl px-6 pb-20 pt-8">
        <section className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-xs uppercase tracking-widest text-emerald-300">
              Website Speed & SEO Auto‑Fix
            </p>
            <h1 className="mt-4 text-5xl font-semibold leading-tight md:text-6xl">
              Turn complex audits into simple fixes in minutes.
            </h1>
            <p className="mt-4 text-lg text-white/70">
              Paste your URL. Get clear, beginner‑friendly diagnostics and
              step‑by‑step fixes for speed, Core Web Vitals, SEO, and
              accessibility.
            </p>
            <div className="mt-8">
              <ScanForm />
            </div>
            <div className="mt-6 flex flex-wrap gap-3 text-xs text-white/50">
              <span className="rounded-full border border-white/10 px-3 py-1">No setup</span>
              <span className="rounded-full border border-white/10 px-3 py-1">Action‑first</span>
              <span className="rounded-full border border-white/10 px-3 py-1">Affordable</span>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="text-xs uppercase tracking-widest text-white/50">Example fix</p>
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-slate-950 p-4">
                <h3 className="text-lg font-semibold">❌ Large hero image</h3>
                <p className="mt-2 text-sm text-white/70">
                  Your homepage image is too large. This slows your site for
                  mobile users and hurts Google rankings.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950 p-4">
                <p className="text-sm text-emerald-300">🛠 How to fix it</p>
                <p className="mt-2 text-sm text-white/70">
                  Compress the image and serve WebP. Make sure width and height
                  are set to avoid layout shift.
                </p>
                <pre className="mt-3 rounded-xl bg-slate-900 p-3 text-xs text-white/70">
{`<img src="/hero.webp" width="1200" height="700" loading="lazy" />`}
                </pre>
              </div>
              <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-200">
                🚀 Expected improvement: 0.8–1.6s faster LCP
              </div>
            </div>
          </div>
        </section>

        <section className="mt-20 grid gap-6 md:grid-cols-4">
          {[
            {
              title: "Speed",
              copy: "Fix Core Web Vitals and reduce load time.",
            },
            {
              title: "SEO",
              copy: "Resolve metadata, crawlability, and on‑page issues.",
            },
            {
              title: "Accessibility",
              copy: "Remove blockers for real users and compliance.",
            },
            {
              title: "Best Practices",
              copy: "Harden security and modern performance basics.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-white/70">{item.copy}</p>
            </div>
          ))}
        </section>

        <section className="mt-20 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
            <p className="text-xs uppercase tracking-widest text-white/50">How it works</p>
            <ol className="mt-6 space-y-4 text-sm text-white/70">
              <li>1. We run PageSpeed Insights + Lighthouse under the hood.</li>
              <li>2. We map audits to clear, fix‑first issue cards.</li>
              <li>3. You get steps, code examples, and expected impact.</li>
            </ol>
            <a
              href="/pricing"
              className="mt-6 inline-flex rounded-full bg-emerald-400 px-5 py-2 text-sm font-semibold text-slate-900"
            >
              See pricing
            </a>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
            <p className="text-xs uppercase tracking-widest text-white/50">What you get</p>
            <div className="mt-6 grid gap-4">
              {[
                "Plain‑English diagnostics with severity labels",
                "Step‑by‑step fixes you can copy‑paste",
                "Scan history to track improvements",
                "PDF exports for clients and stakeholders",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-slate-950/80 p-4 text-sm text-white/70"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-20 rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur">
          <h2 className="text-3xl font-semibold">Ready to fix your site?</h2>
          <p className="mt-3 text-white/70">
            Run a free scan and start fixing issues today.
          </p>
          <div className="mt-6 flex justify-center">
            <ScanForm />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
