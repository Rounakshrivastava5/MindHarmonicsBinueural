import os
import io
import asyncio
import numpy as np
import scipy.io.wavfile as wavfile
import miniaudio
from typing import List, Tuple
from app.audio.binaural import generate_binaural_wave
from app.audio.tts import generate_speech_for_text
from app.core.config import settings

def decode_audio_to_pcm(audio_bytes: bytes, target_sample_rate: int = 44100) -> np.ndarray:
    """
    Decodes MP3 or WAV bytes into a 2D float32 numpy array (samples, channels) at target_sample_rate.
    Returns array with values in [-1.0, 1.0].
    """
    try:
        decoded = miniaudio.decode(audio_bytes, sample_rate=target_sample_rate, nchannels=2)
        samples = np.frombuffer(decoded.samples, dtype=np.int16)
        float_samples = samples.astype(np.float32) / 32768.0
        stereo_samples = float_samples.reshape(-1, 2)
        return stereo_samples
    except Exception as e:
        print(f"Error decoding audio with miniaudio: {e}")
        # Fallback: empty 1 sec silence
        return np.zeros((target_sample_rate, 2), dtype=np.float32)

async def synthesize_composite_track(
    track_id: str,
    affirmations: List[str],
    loop_count: int = 3,
    carrier_freq: float = 216.0,
    beat_freq: float = 6.0,
    speech_volume: float = 0.8,
    binaural_volume: float = 0.5,
    voice_id: str = "en-US-AvaNeural",
    pause_duration: float = 2.0,
    sample_rate: int = 44100
) -> Tuple[str, float]:
    """
    Synthesizes a complete composite track:
    1. Speech loops over affirmations
    2. Binaural background beat wave
    3. Combined stereo output rendered as WAV
    Returns (file_path, total_duration_seconds).
    """
    # 1. Synthesize TTS for each statement in parallel
    tts_tasks = [generate_speech_for_text(text, voice_id) for text in affirmations]
    raw_audio_results = await asyncio.gather(*tts_tasks)

    # 2. Decode and assemble speech loop
    pause_samples = int(sample_rate * pause_duration)
    silence_pad = np.zeros((pause_samples, 2), dtype=np.float32)

    speech_segments = []
    for raw_bytes in raw_audio_results:
        pcm_data = decode_audio_to_pcm(raw_bytes, target_sample_rate=sample_rate)
        speech_segments.append(pcm_data)
        speech_segments.append(silence_pad)

    if not speech_segments:
        # 5 seconds default if empty
        one_loop_speech = np.zeros((sample_rate * 5, 2), dtype=np.float32)
    else:
        one_loop_speech = np.vstack(speech_segments)

    # Repeat loop
    full_speech = np.tile(one_loop_speech, (loop_count, 1))
    total_samples = len(full_speech)
    total_duration = total_samples / sample_rate

    # 3. Synthesize binaural beat wave for the exact duration
    binaural_wave = generate_binaural_wave(
        carrier_freq=carrier_freq,
        beat_freq=beat_freq,
        duration=total_duration,
        sample_rate=sample_rate,
        volume=binaural_volume
    )

    # Ensure equal length
    min_len = min(len(full_speech), len(binaural_wave))
    full_speech = full_speech[:min_len]
    binaural_wave = binaural_wave[:min_len]

    # Apply volume scaling to speech
    full_speech = full_speech * speech_volume

    # 4. Mix speech and binaural
    composite = full_speech + binaural_wave

    # Normalize to avoid clipping
    max_val = np.max(np.abs(composite))
    if max_val > 0.98:
        composite = composite * (0.95 / max_val)

    # 5. Write WAV file to storage
    file_name = f"track_{track_id}.wav"
    output_path = settings.MEDIA_DIR / file_name

    int16_pcm = (composite * 32767).astype(np.int16)
    wavfile.write(output_path, sample_rate, int16_pcm)

    return str(output_path), total_duration
