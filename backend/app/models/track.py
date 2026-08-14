from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Float, Boolean, JSON, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Track(Base):
    __tablename__ = "tracks"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=True) # Associated owner
    title = Column(String, nullable=False)
    genre_id = Column(Integer, ForeignKey("genres.id"), nullable=False)
    binaural_preset_id = Column(Integer, ForeignKey("binaural_presets.id"), nullable=False)
    affirmations = Column(JSON, nullable=False)
    loop_count = Column(Integer, nullable=False, default=3)
    speech_volume = Column(Float, nullable=False, default=0.8)
    binaural_volume = Column(Float, nullable=False, default=0.5)
    voice_id = Column(String, nullable=False, default="en-US-AvaNeural")
    duration_seconds = Column(Float, nullable=False, default=0.0)
    file_path = Column(String, nullable=False)
    is_favorite = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    genre = relationship("Genre", lazy="selectin")
    binaural_preset = relationship("BinauralPreset", lazy="selectin")
    user = relationship("User", lazy="selectin")
