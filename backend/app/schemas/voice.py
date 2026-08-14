from pydantic import BaseModel

class VoiceResponse(BaseModel):
    id: str
    name: str
    gender: str
    locale: str
    language: str
