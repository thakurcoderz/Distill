# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

YouTube Transcript Generator — a client-server app that fetches YouTube transcripts, groups them into readable paragraphs, and displays them alongside an embedded video player.

## Development Commands

### Backend (Python FastAPI)
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload          # Dev server on :8000
uvicorn app.main:app --port 8000       # Production
```

### Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev      # Dev server on :3000
npm run build    # Production build
npm run lint     # ESLint check
```

### Environment
Frontend reads `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:8000`) for the backend URL.

## Architecture

### Backend (`backend/app/`)
- `main.py` — FastAPI app, CORS config (localhost:3000), router registration
- `routers/transcript.py` — `POST /transcript` (body: `youtube_url`) and `GET /transcript?v=VIDEO_ID`
- `services/video_id.py` — Regex extraction of 11-char video IDs from YouTube URLs
- `services/transcript.py` — Wraps `youtube-transcript-api`; maps library exceptions to HTTP status codes (404/403/429/502)
- `schemas.py` — Pydantic models; groups raw transcript segments into paragraphs based on ≥1.5s gaps between segments

### Frontend (`frontend/src/`)
- `app/page.tsx` — Client component; owns all state (URL, loading, error, transcript, video ID)
- `components/TranscriptInput.tsx` — Form with loading/error states
- `components/TranscriptDisplay.tsx` — Scrollable paragraph list with copy-to-clipboard
- `components/YouTubePlayer.tsx` — YouTube iframe, loaded with `dynamic(..., { ssr: false })`
- `lib/api.ts` — Fetch wrapper with typed response/error handling
- `lib/utils.ts` — `cn()` helper (clsx + tailwind-merge)

### Key Patterns
- Paragraph grouping logic lives in `schemas.py` (`TranscriptResponse.from_raw_transcript`)
- Frontend uses `dynamic` import with `ssr: false` for the YouTube player to avoid hydration issues
- Path alias `@/*` maps to `frontend/src/*`
- Tailwind CSS v4 with OKLCH color system and dark mode support via CSS variables
- shadcn/ui components use the `base-nova` style with Lucide icons
