import { Genre } from './genre.model';
import { BinauralPreset } from './binaural-preset.model';

export interface TrackCreate {
  title: string;
  genre_id: number;
  binaural_preset_id: number;
  affirmations: string[];
  loop_count: number;
  speech_volume: number;
  binaural_volume: number;
  voice_id: string;
  custom_carrier_freq?: number;
  custom_beat_freq?: number;
}

export interface Track {
  id: string;
  title: string;
  genre_id: number;
  binaural_preset_id: number;
  affirmations: string[];
  loop_count: number;
  speech_volume: number;
  binaural_volume: number;
  voice_id: string;
  duration_seconds: number;
  file_path: string;
  is_favorite: boolean;
  created_at: string;
  genre?: Genre;
  binaural_preset?: BinauralPreset;
}

export interface TrackListResponse {
  items: Track[];
  total: number;
  page: number;
  size: number;
}
