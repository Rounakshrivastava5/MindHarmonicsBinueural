from sqlalchemy import Column, Integer, String, Text, Float
from app.core.database import Base

class BinauralPreset(Base):
    __tablename__ = "binaural_presets"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    wave_type = Column(String, nullable=False) # Delta, Theta, Alpha, Beta, Gamma
    beat_frequency = Column(Float, nullable=False) # Hz e.g. 6.0
    carrier_frequency = Column(Float, nullable=False, default=216.0) # Hz base tone
    description = Column(Text, nullable=False)
    recommended_use = Column(String, nullable=False)
