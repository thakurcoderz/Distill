import os
from dotenv import load_dotenv

from fastapi import FastAPI

load_dotenv()
from fastapi.middleware.cors import CORSMiddleware

from app.routers import ai, transcript

app = FastAPI(title="YouTube Transcript API")

# In Docker the frontend proxies all API calls server-side, so the browser never
# directly hits the backend — CORS is only needed for direct browser→backend calls
# (local dev). ALLOWED_ORIGINS can be extended via env if needed.
_extra = os.getenv("ALLOWED_ORIGINS", "")
allowed_origins = ["http://localhost:3000"] + [o for o in _extra.split(",") if o]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(transcript.router, prefix="/transcript", tags=["transcript"])
app.include_router(ai.router, prefix="/ai", tags=["ai"])


@app.get("/health")
def health():
    return {"status": "ok"}
