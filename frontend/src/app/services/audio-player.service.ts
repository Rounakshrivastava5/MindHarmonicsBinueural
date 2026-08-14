import { Injectable, signal, computed, inject } from '@angular/core';
import { Track } from '../models/track.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AudioPlayerService {
  private apiService = inject(ApiService);
  private audio = new Audio();

  // Reactive State Signals
  readonly currentTrack = signal<Track | null>(null);
  readonly isPlaying = signal<boolean>(false);
  readonly currentTime = signal<number>(0);
  readonly duration = signal<number>(0);
  readonly speechVolume = signal<number>(0.8);
  readonly binauralVolume = signal<number>(0.5);
  readonly masterVolume = signal<number>(1.0);
  readonly isLooping = signal<boolean>(true);
  readonly isLoading = signal<boolean>(false);

  readonly formattedCurrentTime = computed(() => this.formatTime(this.currentTime()));
  readonly formattedDuration = computed(() => this.formatTime(this.duration()));
  readonly progressPercent = computed(() => {
    const dur = this.duration();
    return dur > 0 ? (this.currentTime() / dur) * 100 : 0;
  });

  constructor() {
    this.audio.loop = this.isLooping();

    this.audio.addEventListener('timeupdate', () => {
      this.currentTime.set(this.audio.currentTime);
    });

    this.audio.addEventListener('loadedmetadata', () => {
      this.duration.set(this.audio.duration || 0);
      this.isLoading.set(false);
    });

    this.audio.addEventListener('play', () => {
      this.isPlaying.set(true);
    });

    this.audio.addEventListener('pause', () => {
      this.isPlaying.set(false);
    });

    this.audio.addEventListener('ended', () => {
      if (!this.isLooping()) {
        this.isPlaying.set(false);
        this.currentTime.set(0);
      }
    });

    this.audio.addEventListener('error', (e) => {
      console.error('Audio element playback error:', e);
      this.isLoading.set(false);
      this.isPlaying.set(false);
    });
  }

  playTrack(track: Track) {
    const streamUrl = this.apiService.getTrackStreamUrl(track.id);
    
    // If playing the same track, toggle play/pause
    if (this.currentTrack()?.id === track.id) {
      this.togglePlay();
      return;
    }

    this.currentTrack.set(track);
    this.speechVolume.set(track.speech_volume);
    this.binauralVolume.set(track.binaural_volume);
    
    this.isLoading.set(true);
    this.audio.src = streamUrl;
    this.audio.load();
    this.audio.play().catch(err => {
      console.error('Audio play failed:', err);
      this.isLoading.set(false);
    });
  }

  togglePlay() {
    if (!this.currentTrack()) return;
    if (this.isPlaying()) {
      this.audio.pause();
    } else {
      this.audio.play().catch(err => console.error(err));
    }
  }

  seekTo(seconds: number) {
    if (!this.currentTrack()) return;
    this.audio.currentTime = seconds;
    this.currentTime.set(seconds);
  }

  setSpeechVolume(vol: number) {
    this.speechVolume.set(vol);
    this.updateAudioElementVolume();
  }

  setBinauralVolume(vol: number) {
    this.binauralVolume.set(vol);
    this.updateAudioElementVolume();
  }

  setMasterVolume(vol: number) {
    this.masterVolume.set(vol);
    this.updateAudioElementVolume();
  }

  toggleLoop() {
    const next = !this.isLooping();
    this.isLooping.set(next);
    this.audio.loop = next;
  }

  private updateAudioElementVolume() {
    // Overall effective volume blend
    const effective = ((this.speechVolume() + this.binauralVolume()) / 2.0) * this.masterVolume();
    this.audio.volume = Math.min(1.0, Math.max(0.0, effective));
  }

  downloadCurrentTrack() {
    const track = this.currentTrack();
    if (!track) return;
    const url = this.apiService.getTrackStreamUrl(track.id);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${track.title.replace(/\s+/g, '_')}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  private formatTime(secs: number): string {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }
}
