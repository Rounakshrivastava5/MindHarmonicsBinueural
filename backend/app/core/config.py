import os
from pathlib import Path
from pydantic_settings import BaseSettings

BASE_DIR = Path(__file__).resolve().parent.parent.parent
STORAGE_DIR = BASE_DIR / "storage" / "tracks"
STORAGE_DIR.mkdir(parents=True, exist_ok=True)

class Settings(BaseSettings):
    PROJECT_NAME: str = "MindHarmonics API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Database
    DATABASE_URL: str = f"sqlite+aiosqlite:///{BASE_DIR}/mindharmonics.db"
    
    # Storage
    MEDIA_DIR: Path = STORAGE_DIR

    class Config:
        case_sensitive = True

settings = Settings()
