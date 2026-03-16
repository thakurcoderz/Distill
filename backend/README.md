# YouTube Transcript API

FastAPI backend for fetching YouTube video transcripts.

## Setup

```bash
python -m venv .venv
source .venv/bin/activate   # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

## Run

```bash
uvicorn app.main:app --reload --port 8000
```

## Endpoints

- `POST /transcript` — Body: `{ "youtube_url": "..." }`
- `GET /transcript?v=VIDEO_ID` — Alternative for direct video ID
