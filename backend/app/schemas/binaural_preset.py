from pydantic import BaseModel

class BinauralPresetBase(BaseModel):
    slug: str
    name: str
    wave_type: str
    beat_frequency: float
    carrier_frequency: float
    description: str
    recommended_use: str

class BinauralPresetResponse(BinauralPresetBase):
    id: int

    class Config:
        from_attributes = True
