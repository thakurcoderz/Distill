// Empty string = same-origin; Next.js rewrites in next.config.ts then proxy the
// request to the backend container over the internal Docker network.
// Override with NEXT_PUBLIC_API_URL when calling the backend directly (e.g. local
// dev without the rewrite, or a separately hosted backend).
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

/** Map backend error messages to friendlier, actionable user-facing text */
function toUserFriendlyError(raw: string): string {
  const lower = raw.toLowerCase();
  if (lower.includes("invalid") && (lower.includes("url") || lower.includes("video id")))
    return "That doesn't look like a valid YouTube link. Try pasting the full URL (e.g. youtube.com/watch?v=...).";
  if (lower.includes("transcripts disabled"))
    return "This video doesn't have captions. Try another video that has subtitles.";
  if (lower.includes("no transcript") || lower.includes("no captions"))
    return "No captions found. The creator may not have added them—try a different video.";
  if (lower.includes("video unavailable") || lower.includes("unplayable"))
    return "We couldn't find this video. Double-check the URL or try again.";
  if (lower.includes("age-restricted"))
    return "This video is age-restricted; transcripts aren't available.";
  if (lower.includes("too many requests") || lower.includes("try again later"))
    return "Slow down—you're going too fast. Wait a minute and try again.";
  if (lower.includes("could not retrieve") || lower.includes("could not connect"))
    return "Something went wrong on our end. Try again in a moment.";
  if (lower.includes("ai") || lower.includes("openai") || lower.includes("configured"))
    return "AI service is not configured. Add OPENAI_API_KEY to the backend.";
  return raw;
}

export interface AITransformParams {
  transcriptText: string;
  featureType: string;
  refinementInstruction?: string;
  currentOutput?: string;
}

export async function aiTransform(
  params: AITransformParams
): Promise<{ output: string }> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/ai`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        transcript_text: params.transcriptText,
        feature_type: params.featureType,
        refinement_instruction: params.refinementInstruction ?? null,
        current_output: params.currentOutput ?? null,
      }),
    });
  } catch (e) {
    const msg =
      e instanceof TypeError && e.message === "Failed to fetch"
        ? "Could not connect to the server. Is the backend running on port 8000?"
        : e instanceof Error
          ? e.message
          : "AI request failed";
    throw new Error(msg);
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    const raw = Array.isArray(err.detail)
      ? err.detail.map((d: { msg?: string }) => d.msg ?? d).join(", ")
      : err.detail ?? "AI request failed";
    throw new Error(toUserFriendlyError(raw));
  }

  return res.json();
}

export interface TranscriptResponse {
  video_id: string;
  paragraphs: string[];
}

export interface ApiError {
  detail: string;
}

export async function getTranscript(
  youtubeUrl: string
): Promise<TranscriptResponse> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/transcript`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ youtube_url: youtubeUrl }),
    });
  } catch (e) {
    const msg =
      e instanceof TypeError && e.message === "Failed to fetch"
        ? "Could not connect to the server. Is the backend running on port 8000?"
        : e instanceof Error
          ? e.message
          : "Failed to fetch transcript";
    throw new Error(msg);
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    const raw = Array.isArray(err.detail)
      ? err.detail.map((d: { msg?: string }) => d.msg ?? d).join(", ")
      : err.detail ?? "Failed to fetch transcript";
    throw new Error(toUserFriendlyError(raw));
  }

  return res.json();
}
