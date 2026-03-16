import re
from typing import Optional

# YouTube video IDs are 11 characters: alphanumeric, underscore, hyphen
# Supports: watch?v=, youtu.be/, embed/, shorts/, and bare ID
VIDEO_ID_PATTERN = re.compile(
    r"(?:v=|\/shorts\/|\/embed\/|\/)([0-9A-Za-z_-]{11})(?:[\?\&\/]|$)|^([0-9A-Za-z_-]{11})$"
)


def extract_video_id(url_or_id: str) -> Optional[str]:
    """
    Extract YouTube video ID from a URL or bare video ID.

    Supports:
    - https://www.youtube.com/watch?v=VIDEO_ID
    - https://youtube.com/watch?v=VIDEO_ID
    - https://youtu.be/VIDEO_ID
    - https://www.youtube.com/embed/VIDEO_ID
    - https://youtube.com/shorts/VIDEO_ID
    - Bare VIDEO_ID (11 chars)
    """
    if not url_or_id or not isinstance(url_or_id, str):
        return None

    s = url_or_id.strip()
    if not s:
        return None

    match = VIDEO_ID_PATTERN.search(s)
    if match:
        return match.group(1) or match.group(2)
    return None
