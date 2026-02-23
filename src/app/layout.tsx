import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FixSpeed - Website Speed & SEO Auto-Fix Tool",
  description:
    "Paste your URL. Get beginner-friendly diagnostics and step-by-step fixes for speed, SEO, and accessibility.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
