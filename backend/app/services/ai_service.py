"""AI service for transcript transformations using OpenAI."""

import os
from typing import Optional

from openai import OpenAI

MAX_TRANSCRIPT_CHARS = 48_000  # ~12k tokens for gpt-4o-mini context

FEATURE_PROMPTS = {
    "summary": """You are a concise summarizer. Given a transcript, produce a 2-3 paragraph summary. Be direct and informative. Output only the summary, nothing else.""",
    "key_insights": """You extract key insights from transcripts. Produce 5-7 numbered insights. Each insight should be one clear sentence. Output only the numbered list, nothing else.""",
    "bullet_points": """You extract main points from transcripts. Produce bullet points covering the key content. Output only the bullet list, nothing else.""",
    "flashcards": """You create study flashcards from transcripts. Produce Q&A pairs in this format:
Q: [question]
A: [answer]

Output only the Q&A pairs, nothing else. Create 5-10 pairs.""",
    "blog_post": """You write blog posts from transcripts. Produce a structured article with: intro paragraph, 2-4 body sections with headings, conclusion. Use markdown for headings. Output only the article, nothing else.""",
    "linkedin_article": """You write LinkedIn articles from transcripts. Professional tone, value-driven, hook at the start. ~1000-1500 characters. Suitable for LinkedIn. Output only the article, nothing else.""",
}


def _truncate(text: str, max_chars: int = MAX_TRANSCRIPT_CHARS) -> str:
    if len(text) <= max_chars:
        return text
    return text[:max_chars] + "\n\n[... transcript truncated ...]"


def _get_client() -> OpenAI:
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY is not set")
    return OpenAI(api_key=api_key)


def process(
    transcript_text: str,
    feature_type: str,
    refinement_instruction: Optional[str] = None,
    current_output: Optional[str] = None,
) -> str:
    """
    Generate or refine AI output.

    - Generate mode: refinement_instruction and current_output both None/empty
    - Refine mode: both provided
    """
    transcript = _truncate(transcript_text)
    client = _get_client()
    model = os.environ.get("OPENAI_MODEL", "gpt-4o-mini")

    if refinement_instruction and current_output:
        # Refine mode
        system = """You refine content based on user instructions. Apply the refinement exactly. Output only the refined content, nothing else."""
        user = f"""Transcript excerpt (for context):
{transcript[:8000]}

Current output to refine:
{current_output}

User instruction: {refinement_instruction}

Produce the refined version:"""
    else:
        # Generate mode
        if feature_type not in FEATURE_PROMPTS:
            raise ValueError(f"Unknown feature_type: {feature_type}")
        system = FEATURE_PROMPTS[feature_type]
        user = f"Transcript:\n\n{transcript}"

    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
    )
    content = response.choices[0].message.content
    return content.strip() if content else ""
