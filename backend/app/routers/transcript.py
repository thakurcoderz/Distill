from typing import Optional

from fastapi import APIRouter, HTTPException, Query

from app.schemas import TranscriptRequest, TranscriptResponse, segments_to_paragraphs
from app.services.transcript import TranscriptError, fetch_transcript
from app.services.video_id import extract_video_id

router = APIRouter()


@router.post("", response_model=TranscriptResponse)
def post_transcript(
    body: TranscriptRequest,
    lang: Optional[str] = Query(None, alias="lang"),
):
    """Fetch transcript by YouTube URL. Returns paragraphs (no timestamps)."""
    video_id = extract_video_id(body.youtube_url)
    if not video_id:
        raise HTTPException(status_code=400, detail="Invalid YouTube URL or video ID")

    try:
        segments = fetch_transcript(
            video_id,
            languages=[lang] if lang else None,
        )
    except TranscriptError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)

    paragraphs = segments_to_paragraphs(segments)
    return TranscriptResponse(video_id=video_id, paragraphs=paragraphs)


@router.get("", response_model=TranscriptResponse)
def get_transcript(
    v: str = Query(..., description="YouTube video ID"),
    lang: Optional[str] = Query(None, alias="lang"),
):
    """Fetch transcript by video ID. Returns paragraphs (no timestamps)."""
    video_id = extract_video_id(v) or (v if len(v) == 11 and v.replace("-", "").replace("_", "").isalnum() else None)
    if not video_id:
        raise HTTPException(status_code=400, detail="Invalid video ID")

    try:
        segments = fetch_transcript(
            video_id,
            languages=[lang] if lang else None,
        )
    except TranscriptError as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)

    paragraphs = segments_to_paragraphs(segments)
    return TranscriptResponse(video_id=video_id, paragraphs=paragraphs)
