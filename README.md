# Distill

Distill any YouTube video into a transcript, summary, blog post, and more. Paste a URL and get the transcript in paragraphs, then use AI to generate summaries, key insights, bullet points, flashcards, blog posts, or LinkedIn articles.

## Tech Stack

| Layer | Stack |
|-------|-------|
| Backend | Python + FastAPI + youtube-transcript-api + OpenAI |
| Frontend | Next.js 16 + shadcn/ui |
| AI | OpenAI (GPT) for transcript transformations |

## Features

- **Transcript** — Fetch YouTube transcripts as readable paragraphs (no timestamps)
- **Copy** — One-click copy of the full transcript
- **AI Tools** — Summary, Key Insights, Bullet Points, Flashcards, Blog Post, LinkedIn Article
- **Embedded player** — Watch the video alongside the transcript

## Setup

### Option 1: Local development

**Backend**

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env        # Add your OPENAI_API_KEY
uvicorn app.main:app --reload --port 8000
```

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The frontend proxies `/transcript` and `/ai` to the backend via Next.js rewrites (`BACKEND_URL` defaults to `http://localhost:8000`).

### Option 2: Docker

```bash
cp backend/.env.example backend/.env   # Add OPENAI_API_KEY
docker compose up --build
```

Open [http://localhost:3000](http://localhost:3000). The frontend container proxies API calls to the backend over the internal network.

## Environment

| Variable | Where | Description |
|----------|-------|-------------|
| `OPENAI_API_KEY` | backend | Required for AI features |
| `OPENAI_MODEL` | backend | Optional, defaults to `gpt-4o-mini` |
| `BACKEND_URL` | frontend (server) | Backend URL for rewrites. Default: `http://localhost:8000` |
| `NEXT_PUBLIC_API_URL` | frontend | Override to call backend directly (e.g. `http://localhost:8000`) instead of same-origin proxy |

## API

- `POST /transcript` — Body: `{ "youtube_url": "..." }` → Returns `{ video_id, paragraphs }`
- `GET /transcript?v=VIDEO_ID` — Fetch by video ID
- `POST /ai` — Body: `{ transcript_text, feature_type, ... }` → AI transformations

## Usage

1. Paste a YouTube URL (or video ID) in the input
2. Click to fetch the transcript
3. View the transcript as paragraphs and copy it
4. Switch to the **AI Tools** tab to generate summaries, blog posts, etc.
