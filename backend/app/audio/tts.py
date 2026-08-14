import os
import io
import asyncio
import numpy as np
import scipy.io.wavfile as wavfile
import edge_tts
from typing import List, Tuple

VOICE_PRESETS = [
    {"id": "en-US-AvaNeural", "name": "Ava (Calm Female - English US)", "gender": "Female", "locale": "en-US", "language": "English"},
    {"id": "en-US-AndrewNeural", "name": "Andrew (Warm Male - English US)", "gender": "Male", "locale": "en-US", "language": "English"},
    {"id": "hi-IN-SwaraNeural", "name": "Swara (स्वर - Calm Female Hindi)", "gender": "Female", "locale": "hi-IN", "language": "Hindi"},
    {"id": "hi-IN-MadhurNeural", "name": "Madhur (मधुर - Deep Male Hindi)", "gender": "Male", "locale": "hi-IN", "language": "Hindi"},
    {"id": "en-US-EmmaNeural", "name": "Emma (Gentle Female - English US)", "gender": "Female", "locale": "en-US", "language": "English"},
    {"id": "en-GB-SoniaNeural", "name": "Sonia (Serene Female - UK)", "gender": "Female", "locale": "en-GB", "language": "English"},
    {"id": "en-AU-WilliamNeural", "name": "William (Deep Male - AU)", "gender": "Male", "locale": "en-AU", "language": "English"},
]

async def generate_speech_for_text(text: str, voice_id: str = "en-US-AvaNeural") -> bytes:
    """Generates audio bytes for a single text statement using edge-tts with 8s timeout and fallback."""
    try:
        async def _fetch():
            communicate = edge_tts.Communicate(text, voice_id, rate="-5%", pitch="-2Hz")
            audio_stream = io.BytesIO()
            async for chunk in communicate.stream():
                if chunk["type"] == "audio":
                    audio_stream.write(chunk["data"])
            return audio_stream.getvalue()

        return await asyncio.wait_for(_fetch(), timeout=8.0)
    except Exception as e:
        print(f"Edge-TTS synthesis error/timeout for voice {voice_id}: {e}. Using fallback audio generator.")
        return _generate_fallback_chime(text)

def _generate_fallback_chime(text: str, sample_rate: int = 44100) -> bytes:
    """Generates a pleasant ambient chime sound if TTS engine is offline or times out."""
    duration = min(6.0, max(2.5, len(text) * 0.08))
    t = np.linspace(0, duration, int(sample_rate * duration), endpoint=False)
    chime = 0.3 * (np.sin(2 * np.pi * 440 * t) + np.sin(2 * np.pi * 554.37 * t) + np.sin(2 * np.pi * 659.25 * t))
    envelope = np.exp(-1.5 * t)
    audio = chime * envelope
    int_audio = (audio * 32767).astype(np.int16)
    stereo_audio = np.column_stack((int_audio, int_audio))
    bytes_io = io.BytesIO()
    wavfile.write(bytes_io, sample_rate, stereo_audio)
    return bytes_io.getvalue()
