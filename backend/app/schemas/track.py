from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field
from app.schemas.genre import GenreResponse
from app.schemas.binaural_preset import BinauralPresetResponse

class TrackCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=100)
    genre_id: int
    binaural_preset_id: int
    affirmations: List[str] = Field(..., min_items=1)
    loop_count: int = Field(default=3, ge=1, le=10)
    speech_volume: float = Field(default=0.8, ge=0.0, le=1.0)
    binaural_volume: float = Field(default=0.5, ge=0.0, le=1.0)
    voice_id: str = Field(default="en-US-AvaNeural")
    custom_carrier_freq: Optional[float] = None
    custom_beat_freq: Optional[float] = None

class TrackResponse(BaseModel):
    id: str
    title: str
    genre_id: int
    binaural_preset_id: int
    affirmations: List[str]
    loop_count: int
    speech_volume: float
    binaural_volume: float
    voice_id: str
    duration_seconds: float
    file_path: str
    is_favorite: bool
    created_at: datetime
    genre: Optional[GenreResponse] = None
    binaural_preset: Optional[BinauralPresetResponse] = None

    class Config:
        from_attributes = True

class TrackListResponse(BaseModel):
    items: List[TrackResponse]
    total: int
    page: int
    size: int
