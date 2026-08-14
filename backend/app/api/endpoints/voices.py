from typing import List
from fastapi import APIRouter
from app.audio.tts import VOICE_PRESETS
from app.schemas.voice import VoiceResponse

router = APIRouter()

@router.get("", response_model=List[VoiceResponse])
async def get_voices():
    """Retrieve available neural TTS voice options."""
    return VOICE_PRESETS
