# FixSpeed — Website Speed & SEO Auto-Fix Tool

Paste a URL and get beginner‑friendly diagnostics with step‑by‑step fixes for speed, SEO, accessibility, and best practices.

## What’s inside
- Next.js app (landing, scan results, dashboard, pricing)
- Scan pipeline with PageSpeed Insights (Lighthouse data)
- Background worker with BullMQ + Redis
- Prisma + Postgres for scans and history
- Stripe billing + PDF export

## Getting Started
```bash
npm install
npm run db:migrate
npm run dev
npm run worker
```

Open `http://localhost:3000`.

## Environment Variables
Copy `.env.example` to `.env.local` and fill in values.
Set `ENABLE_HEADLESS=1` if you want Puppeteer to collect live page metadata.

## Deployment Notes
- Deploy Next.js to Vercel.
- Deploy worker to Fly.io/Render with `npm run worker`.
- Use a managed Postgres instance and Redis.
