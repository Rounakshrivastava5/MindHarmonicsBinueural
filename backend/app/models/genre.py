from sqlalchemy import Column, Integer, String, Text, JSON
from app.core.database import Base

class Genre(Base):
    __tablename__ = "genres"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    hindi_title = Column(String, nullable=True)
    description = Column(Text, nullable=False)
    hindi_description = Column(Text, nullable=True)
    icon = Column(String, nullable=False, default="sparkles")
    gradient = Column(String, nullable=False, default="linear-gradient(135deg, #4f46e5, #7c3aed)")
    default_affirmations = Column(JSON, nullable=False) # List of English statements
    hindi_affirmations = Column(JSON, nullable=True)   # List of Hindi statements
