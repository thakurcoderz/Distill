# YouTube Transcript Generator

Fetch and display YouTube video transcripts with timestamps. Click transcript segments to seek the video.

## Tech Stack

- **Backend**: Python + FastAPI + youtube-transcript-api
- **Frontend**: Next.js 14 + shadcn/ui

## Setup

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The frontend expects the backend at `http://localhost:8000` (or set `NEXT_PUBLIC_API_URL`).

## Usage

1. Paste a YouTube URL (or video ID) in the input
2. Click "Get Transcript"
3. View the transcript with optional timestamps
4. Toggle "Show timestamps" to include/exclude `[HH:MM:SS]` prefixes
5. Click "Copy" to copy the transcript to clipboard
6. Click a transcript segment to seek the embedded video to that timestamp
