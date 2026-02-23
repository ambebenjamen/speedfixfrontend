import Link from "next/link";
import LogoLink from "./LogoLink";
import AuthButtons from "./AuthButtons";

export default function SiteHeader() {
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
      <LogoLink />
      <nav className="flex items-center gap-4 text-sm text-white/70">
        <Link href="/pricing">Pricing</Link>
        <Link href="/dashboard">Dashboard</Link>
        <AuthButtons />
      </nav>
    </header>
  );
}
