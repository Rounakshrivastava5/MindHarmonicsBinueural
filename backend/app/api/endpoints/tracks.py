import os
import uuid
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, delete, or_
from app.core.database import get_db
from app.models.track import Track
from app.models.genre import Genre
from app.models.binaural_preset import BinauralPreset
from app.models.user import User
from app.schemas.track import TrackCreate, TrackResponse, TrackListResponse
from app.audio.mixer import synthesize_composite_track
from app.api.deps import get_current_user_optional

router = APIRouter()

@router.post("/generate", response_model=TrackResponse, status_code=status.HTTP_201_CREATED)
async def generate_track(
    payload: TrackCreate, 
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """
    Generate a custom affirmation + binaural beat audio track.
    Links track to current_user if authenticated.
    """
    genre = await db.get(Genre, payload.genre_id)
    if not genre:
        raise HTTPException(status_code=404, detail="Genre not found")

    preset = await db.get(BinauralPreset, payload.binaural_preset_id)
    if not preset:
        raise HTTPException(status_code=404, detail="Binaural preset not found")

    track_id = str(uuid.uuid4())

    carrier_freq = payload.custom_carrier_freq or preset.carrier_frequency
    beat_freq = payload.custom_beat_freq or preset.beat_frequency

    # Synthesize composite audio track
    file_path, duration = await synthesize_composite_track(
        track_id=track_id,
        affirmations=payload.affirmations,
        loop_count=payload.loop_count,
        carrier_freq=carrier_freq,
        beat_freq=beat_freq,
        speech_volume=payload.speech_volume,
        binaural_volume=payload.binaural_volume,
        voice_id=payload.voice_id
    )

    track = Track(
        id=track_id,
        user_id=current_user.id if current_user else None,
        title=payload.title,
        genre_id=payload.genre_id,
        binaural_preset_id=payload.binaural_preset_id,
        affirmations=payload.affirmations,
        loop_count=payload.loop_count,
        speech_volume=payload.speech_volume,
        binaural_volume=payload.binaural_volume,
        voice_id=payload.voice_id,
        duration_seconds=duration,
        file_path=file_path,
        is_favorite=False
    )

    db.add(track)
    await db.commit()
    await db.refresh(track)

    return track

@router.get("", response_model=TrackListResponse)
async def list_tracks(
    genre_id: Optional[int] = None,
    favorite_only: Optional[bool] = False,
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """Retrieve saved tracks with optional genre filter, favorite filter, and user filter."""
    stmt = select(Track).order_by(Track.created_at.desc())

    if current_user:
        # Show tracks belonging to user OR guest tracks
        stmt = stmt.where(or_(Track.user_id == current_user.id, Track.user_id == None))

    if genre_id:
        stmt = stmt.where(Track.genre_id == genre_id)
    if favorite_only:
        stmt = stmt.where(Track.is_favorite == True)

    # Count total
    count_stmt = select(func.count()).select_from(stmt.subquery())
    total_result = await db.execute(count_stmt)
    total = total_result.scalar() or 0

    # Paginate
    offset = (page - 1) * size
    stmt = stmt.offset(offset).limit(size)
    result = await db.execute(stmt)
    tracks = result.scalars().all()

    return TrackListResponse(
        items=tracks,
        total=total,
        page=page,
        size=size
    )

@router.get("/{track_id}", response_model=TrackResponse)
async def get_track(track_id: str, db: AsyncSession = Depends(get_db)):
    """Retrieve track by ID."""
    track = await db.get(Track, track_id)
    if not track:
        raise HTTPException(status_code=404, detail="Track not found")
    return track

@router.get("/{track_id}/stream")
async def stream_track_audio(track_id: str, db: AsyncSession = Depends(get_db)):
    """Stream generated composite audio file for playback."""
    track = await db.get(Track, track_id)
    if not track:
        raise HTTPException(status_code=404, detail="Track not found")

    if not os.path.exists(track.file_path):
        raise HTTPException(status_code=404, detail="Audio file missing from storage")

    filename = f"{track.title.replace(' ', '_')}.wav"
    return FileResponse(
        path=track.file_path,
        media_type="audio/wav",
        filename=filename
    )

@router.post("/{track_id}/favorite", response_model=TrackResponse)
async def toggle_favorite(track_id: str, db: AsyncSession = Depends(get_db)):
    """Toggle favorite status of a track."""
    track = await db.get(Track, track_id)
    if not track:
        raise HTTPException(status_code=404, detail="Track not found")

    track.is_favorite = not track.is_favorite
    await db.commit()
    await db.refresh(track)
    return track

@router.delete("/{track_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_track(track_id: str, db: AsyncSession = Depends(get_db)):
    """Delete track and remove physical audio file."""
    track = await db.get(Track, track_id)
    if not track:
        raise HTTPException(status_code=404, detail="Track not found")

    if os.path.exists(track.file_path):
        try:
            os.remove(track.file_path)
        except Exception as e:
            print(f"Failed to delete file {track.file_path}: {e}")

    await db.delete(track)
    await db.commit()
    return None
