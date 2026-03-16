# Distill Frontend

Next.js 16 frontend for [Distill](../README.md) — YouTube transcript extraction and AI-powered transformations.

## Tech Stack

- **Next.js 16** (App Router)
- **shadcn/ui** — Button, Input, Card, Tabs, Alert, etc.
- **Tailwind CSS** — Styling

## Setup

```bash
npm install
```

## Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

| Variable | Description |
|----------|-------------|
| `BACKEND_URL` | Backend URL for Next.js rewrites. Default: `http://localhost:8000` |
| `NEXT_PUBLIC_API_URL` | Override to call backend directly instead of same-origin proxy (e.g. `http://localhost:8000`) |

The app proxies `/transcript` and `/ai` to the backend via `next.config.ts` rewrites. For local dev, ensure the backend runs on port 8000.

## Scripts

- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run start` — Start production server
- `npm run lint` — Run ESLint
