from fastapi import APIRouter
from app.api.endpoints import genres, binaural_presets, voices, tracks, auth

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(genres.router, prefix="/genres", tags=["Genres"])
api_router.include_router(binaural_presets.router, prefix="/binaural-presets", tags=["Binaural Presets"])
api_router.include_router(voices.router, prefix="/voices", tags=["Voices"])
api_router.include_router(tracks.router, prefix="/tracks", tags=["Tracks"])
