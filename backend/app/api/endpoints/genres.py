from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.genre import Genre
from app.schemas.genre import GenreResponse

router = APIRouter()

@router.get("", response_model=List[GenreResponse])
async def get_genres(db: AsyncSession = Depends(get_db)):
    """Retrieve all available affirmation genres."""
    result = await db.execute(select(Genre).order_by(Genre.id))
    genres = result.scalars().all()
    return genres
