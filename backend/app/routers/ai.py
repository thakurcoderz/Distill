from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.services.ai_service import process

router = APIRouter()


class AIRequest(BaseModel):
    transcript_text: str = Field(..., description="Full transcript text")
    feature_type: str = Field(..., description="summary, key_insights, bullet_points, flashcards, blog_post, linkedin_article")
    refinement_instruction: Optional[str] = Field(None, description="For refine mode")
    current_output: Optional[str] = Field(None, description="For refine mode")


class AIResponse(BaseModel):
    output: str


@router.post("", response_model=AIResponse)
def post_ai(body: AIRequest):
    """Generate or refine AI output. Refine when both refinement_instruction and current_output are provided."""
    try:
        output = process(
            transcript_text=body.transcript_text,
            feature_type=body.feature_type,
            refinement_instruction=body.refinement_instruction,
            current_output=body.current_output,
        )
        return AIResponse(output=output)
    except ValueError as e:
        if "OPENAI_API_KEY" in str(e):
            raise HTTPException(status_code=503, detail="AI service is not configured. Set OPENAI_API_KEY.")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        msg = str(e).lower()
        if "rate" in msg or "limit" in msg:
            raise HTTPException(status_code=429, detail="Too many requests. Try again later.")
        if "auth" in msg or "invalid" in msg or "key" in msg:
            raise HTTPException(status_code=503, detail="AI service configuration error.")
        raise HTTPException(status_code=502, detail=f"AI request failed: {str(e)}")
