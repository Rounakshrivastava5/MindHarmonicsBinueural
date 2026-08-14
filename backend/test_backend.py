import asyncio
import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import AsyncSessionLocal
from app.core.init_db import init_db
from app.models.genre import Genre
from app.models.binaural_preset import BinauralPreset
from sqlalchemy import select

async def main():
    print("Testing DB initialization...")
    async with AsyncSessionLocal() as session:
        await init_db(session)
        print("DB initialized!")

        genres = (await session.execute(select(Genre))).scalars().all()
        print(f"Loaded {len(genres)} default genres:")
        for g in genres:
            print(f" - [{g.id}] {g.title} ({g.slug})")

        presets = (await session.execute(select(BinauralPreset))).scalars().all()
        print(f"Loaded {len(presets)} default binaural presets:")
        for p in presets:
            print(f" - [{p.id}] {p.name} ({p.wave_type} - {p.beat_frequency}Hz)")

if __name__ == "__main__":
    asyncio.run(main())
