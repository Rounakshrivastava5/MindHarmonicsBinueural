import numpy as np
import scipy.io.wavfile as wavfile
import io

def generate_binaural_wave(
    carrier_freq: float = 216.0,
    beat_freq: float = 6.0,
    duration: float = 60.0,
    sample_rate: int = 44100,
    volume: float = 0.5
) -> np.ndarray:
    """
    Generates a stereo binaural beat audio array.
    Left channel: carrier_freq
    Right channel: carrier_freq + beat_freq
    Includes warm sub-harmonics and smooth envelope fades.
    Returns float32 stereo array of shape (samples, 2), normalized to [-1.0, 1.0].
    """
    num_samples = int(sample_rate * duration)
    t = np.linspace(0, duration, num_samples, endpoint=False)

    left_freq = carrier_freq
    right_freq = carrier_freq + beat_freq

    # Primary sine waves
    left_channel = np.sin(2 * np.pi * left_freq * t)
    right_channel = np.sin(2 * np.pi * right_freq * t)

    # Add subtle octave sub-harmonic for ambient depth (warm binaural drone)
    sub_left = 0.25 * np.sin(2 * np.pi * (left_freq / 2.0) * t)
    sub_right = 0.25 * np.sin(2 * np.pi * (right_freq / 2.0) * t)

    left_total = (left_channel + sub_left) / 1.25
    right_total = (right_channel + sub_right) / 1.25

    # Gentle ambient pink-ish noise texture for relaxing background ambiance
    noise = np.random.normal(0, 0.015, num_samples)
    
    left_total += noise
    right_total += noise

    # Smooth fade in / fade out (1.5 seconds)
    fade_len = int(sample_rate * 1.5)
    if fade_len > num_samples // 2:
        fade_len = num_samples // 2

    fade_in = np.linspace(0, 1, fade_len)
    fade_out = np.linspace(1, 0, fade_len)

    envelope = np.ones(num_samples)
    envelope[:fade_len] *= fade_in
    envelope[-fade_len:] *= fade_out

    left_total *= envelope * volume
    right_total *= envelope * volume

    # Stack left and right into stereo array (samples, 2)
    stereo_wave = np.column_stack((left_total, right_total))
    
    # Clip to prevent distortion
    stereo_wave = np.clip(stereo_wave, -1.0, 1.0)
    
    return stereo_wave.astype(np.float32)

def wave_to_wav_bytes(audio_data: np.ndarray, sample_rate: int = 44100) -> bytes:
    """Converts float32 audio array (-1 to 1) to 16-bit PCM WAV bytes."""
    int_data = (audio_data * 32767).astype(np.int16)
    bytes_io = io.BytesIO()
    wavfile.write(bytes_io, sample_rate, int_data)
    return bytes_io.getvalue()
