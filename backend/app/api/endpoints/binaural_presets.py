from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.binaural_preset import BinauralPreset
from app.schemas.binaural_preset import BinauralPresetResponse

router = APIRouter()

@router.get("", response_model=List[BinauralPresetResponse])
async def get_binaural_presets(db: AsyncSession = Depends(get_db)):
    """Retrieve all available binaural wave presets."""
    result = await db.execute(select(BinauralPreset).order_by(BinauralPreset.id))
    presets = result.scalars().all()
    return presets
