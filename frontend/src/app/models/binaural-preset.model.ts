export interface BinauralPreset {
  id: number;
  slug: string;
  name: string;
  wave_type: string; // Delta, Theta, Alpha, Beta, Gamma
  beat_frequency: number;
  carrier_frequency: number;
  description: string;
  recommended_use: string;
}
