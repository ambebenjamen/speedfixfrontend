import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-black/20">
      <div className="mx-auto grid max-w-6xl gap-6 px-6 py-10 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p className="text-lg font-semibold">FixSpeed</p>
          <p className="mt-2 text-sm text-white/60">
            Speed, SEO, and accessibility fixes you can actually use.
          </p>
          <p className="mt-4 text-xs text-white/40">
            © {new Date().getFullYear()} FixSpeed. All rights reserved.
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-white/50">Product</p>
          <div className="mt-4 flex flex-col gap-2 text-sm text-white/70">
            <Link href="/pricing">Pricing</Link>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/signin">Sign in</Link>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-white/50">Company</p>
          <div className="mt-4 flex flex-col gap-2 text-sm text-white/70">
            <a href="mailto:tambeambe41@gmail.com">Support</a>
            <a href="https://whatsapp.com/dl/">Contact on WhatsApp</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
