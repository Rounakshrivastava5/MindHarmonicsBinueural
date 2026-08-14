import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AudioPlayerService } from '../../services/audio-player.service';
import { WaveVisualizerComponent } from '../wave-visualizer/wave-visualizer.component';

@Component({
  selector: 'app-global-audio-player',
  standalone: true,
  imports: [CommonModule, FormsModule, WaveVisualizerComponent],
  template: `
    @if (audioPlayer.currentTrack(); as track) {
      <div class="sticky-player-wrapper glass-panel">
        
        <!-- Top Track Seek Progress Line -->
        <div class="progress-bar-container" (click)="onSeekClick($event)">
          <div class="progress-bar-fill" [style.width.%]="audioPlayer.progressPercent()"></div>
        </div>

        <div class="player-container">
          
          <!-- Left: Track Metadata -->
          <div class="track-info">
            <div class="genre-icon-mini" [style.background]="track.genre?.gradient || 'linear-gradient(135deg, #6366f1, #06b6d4)'">
              🎵
            </div>
            <div class="track-text">
              <span class="track-title-text">{{ track.title }}</span>
              <div class="track-sub-row">
                <span class="badge badge-cyan mini-badge">
                  {{ track.binaural_preset?.wave_type || 'Binaural' }} ({{ track.binaural_preset?.beat_frequency || 6 }}Hz)
                </span>
                <span class="time-display">{{ audioPlayer.formattedCurrentTime() }} / {{ audioPlayer.formattedDuration() }}</span>
              </div>
            </div>
          </div>

          <!-- Middle: Playback Controls & Wave Visualizer -->
          <div class="player-center">
            <div class="playback-buttons">
              <button 
                class="control-btn loop-btn" 
                [class.active]="audioPlayer.isLooping()" 
                (click)="audioPlayer.toggleLoop()"
                title="Toggle Repeat Loop"
              >
                🔁
              </button>

              <button 
                class="control-btn main-play-btn" 
                (click)="audioPlayer.togglePlay()"
                [disabled]="audioPlayer.isLoading()"
              >
                @if (audioPlayer.isLoading()) {
                  <div class="spinner-mini"></div>
                } @else if (audioPlayer.isPlaying()) {
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
                } @else {
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                }
              </button>
            </div>

            <!-- Mini Live Wave Canvas -->
            <div class="mini-wave-container">
              <app-wave-visualizer
                [isPlaying]="audioPlayer.isPlaying()"
                [beatFreq]="track.binaural_preset?.beat_frequency || 6"
                primaryColor="#6366f1"
                secondaryColor="#06b6d4"
              ></app-wave-visualizer>
            </div>
          </div>

          <!-- Right: Independent Dual Volume Sliders & Actions -->
          <div class="player-right">
            
            <!-- Dual Sliders Popup / Inline -->
            <div class="volume-sliders-group">
              <div class="vol-item" title="Speech Affirmations Volume">
                <span class="vol-icon">🗣️</span>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.05" 
                  [ngModel]="audioPlayer.speechVolume()"
                  (ngModelChange)="audioPlayer.setSpeechVolume($event)"
                >
              </div>

              <div class="vol-item" title="Binaural Beat Volume">
                <span class="vol-icon">🌊</span>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.05" 
                  [ngModel]="audioPlayer.binauralVolume()"
                  (ngModelChange)="audioPlayer.setBinauralVolume($event)"
                >
              </div>
            </div>

            <button class="control-btn action-btn" (click)="audioPlayer.downloadCurrentTrack()" title="Download Track">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            </button>

          </div>

        </div>
      </div>
    }
  `,
  styles: [`
    .sticky-player-wrapper {
      position: fixed;
      bottom: 16px;
      left: 50%;
      transform: translateX(-50%);
      width: calc(100% - 32px);
      max-width: 1200px;
      z-index: 999;
      background: rgba(11, 15, 25, 0.92);
      backdrop-filter: blur(24px);
      border: 1px solid rgba(99, 102, 241, 0.3);
      border-radius: 16px;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.7), 0 0 25px rgba(99, 102, 241, 0.2);
      overflow: hidden;
    }
    .progress-bar-container {
      width: 100%;
      height: 4px;
      background: rgba(255, 255, 255, 0.08);
      cursor: pointer;
    }
    .progress-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #6366f1, #06b6d4);
      transition: width 0.1s linear;
    }
    .player-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 24px;
      gap: 20px;
    }
    .track-info {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 240px;
    }
    .genre-icon-mini {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
    }
    .track-text {
      display: flex;
      flex-direction: column;
    }
    .track-title-text {
      font-weight: 700;
      font-size: 0.95rem;
      color: #ffffff;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 200px;
    }
    .track-sub-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .mini-badge {
      font-size: 0.65rem;
      padding: 2px 6px;
    }
    .time-display {
      font-size: 0.78rem;
      color: var(--text-muted);
    }
    .player-center {
      display: flex;
      align-items: center;
      gap: 16px;
      flex: 1;
      justify-content: center;
    }
    .playback-buttons {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .control-btn {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid var(--border-subtle);
      color: var(--text-main);
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }
    .control-btn:hover {
      background: rgba(255, 255, 255, 0.15);
    }
    .loop-btn {
      width: 34px;
      height: 34px;
      font-size: 0.9rem;
      opacity: 0.5;
    }
    .loop-btn.active {
      opacity: 1;
      border-color: var(--cyan);
      background: rgba(6, 182, 212, 0.2);
    }
    .main-play-btn {
      width: 46px;
      height: 46px;
      background: linear-gradient(135deg, #6366f1, #06b6d4);
      border: none;
      color: #ffffff;
      box-shadow: 0 0 15px rgba(99, 102, 241, 0.4);
    }
    .main-play-btn:hover {
      transform: scale(1.05);
      box-shadow: 0 0 20px rgba(99, 102, 241, 0.6);
    }
    .mini-wave-container {
      width: 140px;
      height: 38px;
    }
    .player-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .volume-sliders-group {
      display: flex;
      gap: 14px;
      background: rgba(0, 0, 0, 0.25);
      padding: 6px 12px;
      border-radius: var(--radius-full);
      border: 1px solid rgba(255, 255, 255, 0.05);
    }
    .vol-item {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .vol-item input[type="range"] {
      width: 70px;
    }
    .vol-icon {
      font-size: 0.85rem;
    }
    .action-btn {
      width: 38px;
      height: 38px;
      border-radius: 10px;
    }
    .spinner-mini {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: #ffffff;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    @media (max-width: 850px) {
      .player-container { flex-wrap: wrap; padding: 10px 16px; }
      .mini-wave-container { display: none; }
      .volume-sliders-group { display: none; }
    }
  `]
})
export class GlobalAudioPlayerComponent {
  audioPlayer = inject(AudioPlayerService);

  onSeekClick(event: MouseEvent) {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const ratio = clickX / rect.width;
    const duration = this.audioPlayer.duration();
    if (duration > 0) {
      this.audioPlayer.seekTo(ratio * duration);
    }
  }
}
