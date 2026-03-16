from pydantic import BaseModel, Field

PARAGRAPH_GAP_SECONDS = 1.5


class TranscriptRequest(BaseModel):
    youtube_url: str = Field(..., description="YouTube URL or video ID")


class TranscriptResponse(BaseModel):
    video_id: str
    paragraphs: list[str]


def segments_to_paragraphs(segments: list[dict]) -> list[str]:
    """Group segments into paragraphs by natural pauses (gaps > 1.5 seconds)."""
    if not segments:
        return []

    paragraphs = []
    current: list[str] = []
    prev_end = 0.0

    for seg in segments:
        gap = seg["start"] - prev_end
        if gap > PARAGRAPH_GAP_SECONDS and current:
            paragraphs.append(" ".join(current))
            current = []
        current.append(seg["text"].strip())
        prev_end = seg["start"] + seg["duration"]

    if current:
        paragraphs.append(" ".join(current))

    return paragraphs
