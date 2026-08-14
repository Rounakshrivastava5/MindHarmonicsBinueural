from typing import List, Optional
from pydantic import BaseModel

class GenreBase(BaseModel):
    slug: str
    title: str
    hindi_title: Optional[str] = None
    description: str
    hindi_description: Optional[str] = None
    icon: str
    gradient: str
    default_affirmations: List[str]
    hindi_affirmations: Optional[List[str]] = None

class GenreResponse(GenreBase):
    id: int

    class Config:
        from_attributes = True
