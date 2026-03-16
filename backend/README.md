# Distill Backend

FastAPI backend for YouTube transcripts and AI-powered transformations.

## Setup

```bash
python -m venv .venv
source .venv/bin/activate   # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env       # Add OPENAI_API_KEY
```

## Run

```bash
uvicorn app.main:app --reload --port 8000
```

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/transcript` | Body: `{ "youtube_url": "..." }` — Returns paragraphs (no timestamps) |
| GET | `/transcript?v=VIDEO_ID` | Fetch transcript by video ID |
| POST | `/ai` | AI transformations (summary, blog post, etc.) — requires `OPENAI_API_KEY` |
| GET | `/health` | Health check |

## Environment

- `OPENAI_API_KEY` — Required for AI features
- `OPENAI_MODEL` — Optional, defaults to `gpt-4o-mini`
- `ALLOWED_ORIGINS` — Comma-separated CORS origins (default includes `http://localhost:3000`)
