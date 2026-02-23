import Link from "next/link";

export default function LogoLink() {
  return (
    <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-400 text-slate-900">
        F
      </span>
      <span>FixSpeed</span>
    </Link>
  );
}
