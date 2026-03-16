from typing import Optional

from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api import (
    TranscriptsDisabled,
    NoTranscriptFound,
    VideoUnavailable,
    VideoUnplayable,
    CouldNotRetrieveTranscript,
    RequestBlocked,
    IpBlocked,
    InvalidVideoId,
    AgeRestricted,
    YouTubeTranscriptApiException,
)


def fetch_transcript(
    video_id: str,
    languages: Optional[list[str]] = None,
) -> list[dict]:
    """
    Fetch transcript for a YouTube video.

    Returns list of segments: [{"text": str, "start": float, "duration": float}, ...]

    Raises HTTPException with appropriate status codes for error cases.
    """
    ytt_api = YouTubeTranscriptApi()
    lang_list = languages or ["en"]

    try:
        fetched = ytt_api.fetch(video_id, languages=lang_list)
        return fetched.to_raw_data()
    except TranscriptsDisabled:
        raise TranscriptError(404, "Transcripts disabled for this video")
    except NoTranscriptFound:
        raise TranscriptError(404, "No transcript available for this video")
    except (VideoUnavailable, VideoUnplayable, InvalidVideoId):
        raise TranscriptError(404, "Video unavailable")
    except AgeRestricted:
        raise TranscriptError(403, "Video is age-restricted")
    except (RequestBlocked, IpBlocked):
        raise TranscriptError(429, "Too many requests; try again later")
    except (CouldNotRetrieveTranscript, YouTubeTranscriptApiException) as e:
        raise TranscriptError(502, f"Could not retrieve transcript: {str(e)}")


class TranscriptError(Exception):
    """Raised when transcript fetch fails. Carries HTTP status and message."""

    def __init__(self, status_code: int, message: str):
        self.status_code = status_code
        self.message = message
        super().__init__(message)
