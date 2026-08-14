import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AudioPlayerService } from '../../services/audio-player.service';
import { Track } from '../../models/track.model';
import { Genre } from '../../models/genre.model';

@Component({
  selector: 'app-track-library',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="library-page container">
      
      <!-- Header -->
      <div class="library-header">
        <div>
          <span class="badge badge-emerald mb-2">📚 Saved Tracks</span>
          <h1 class="page-title">My MindHarmonics Library</h1>
          <p class="page-subtitle">Your personal collection of custom subliminal affirmation and binaural beat audio tracks.</p>
        </div>

        <button class="btn btn-primary" (click)="goToGenerator()">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          <span>Create New Track</span>
        </button>
      </div>

      <!-- Filters & Controls Bar -->
      <div class="controls-bar glass-panel">
        <div class="search-box">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="search-icon"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input 
            type="text" 
            [(ngModel)]="searchQuery" 
            placeholder="Search tracks by title or statement..." 
            class="search-input"
          >
        </div>

        <div class="filter-pills">
          <button 
            class="filter-pill" 
            [class.active]="selectedGenreFilter() === null && !favoritesOnly()" 
            (click)="setFilter(null, false)"
          >
            All Tracks ({{ tracks().length }})
          </button>
          
          <button 
            class="filter-pill favorite-pill" 
            [class.active]="favoritesOnly()" 
            (click)="setFilter(null, true)"
          >
            ❤️ Favorites
          </button>

          @for (genre of genres(); track genre.id) {
            <button 
              class="filter-pill" 
              [class.active]="selectedGenreFilter() === genre.id && !favoritesOnly()" 
              (click)="setFilter(genre.id, false)"
            >
              {{ genre.title }}
            </button>
          }
        </div>
      </div>

      <!-- Track Cards Grid -->
      @if (isLoading()) {
        <div class="loading-state glass-panel">
          <div class="spinner"></div>
          <p>Loading track library...</p>
        </div>
      } @else if (filteredTracks().length === 0) {
        <div class="empty-state glass-panel">
          <div class="empty-icon">🎧</div>
          <h3>No Audio Tracks Found</h3>
          <p>You haven't generated any binaural affirmation tracks matching this filter yet.</p>
          <button class="btn btn-primary" (click)="goToGenerator()">
            Synthesize Your First Track
          </button>
        </div>
      } @else {
        <div class="tracks-grid">
          @for (track of filteredTracks(); track track.id) {
            <div class="track-card glass-panel-interactive" [class.now-playing]="audioPlayer.currentTrack()?.id === track.id">
              
              <!-- Card Header -->
              <div class="card-header">
                <div class="badges-row">
                  @if (track.genre) {
                    <span class="genre-badge" [style.background]="track.genre.gradient">
                      {{ track.genre.title }}
                    </span>
                  }
                  @if (track.binaural_preset) {
                    <span class="wave-badge badge badge-cyan">
                      {{ track.binaural_preset.wave_type }} ({{ track.binaural_preset.beat_frequency }}Hz)
                    </span>
                  }
                </div>

                <button 
                  class="fav-btn" 
                  [class.is-fav]="track.is_favorite" 
                  (click)="toggleFavorite(track, $event)"
                  title="Toggle Favorite"
                >
                  ❤️
                </button>
              </div>

              <!-- Card Content -->
              <div class="card-body">
                <h3 class="track-title">{{ track.title }}</h3>
                <div class="track-meta">
                  <span>⏱️ {{ formatDuration(track.duration_seconds) }}</span>
                  <span>🔁 {{ track.loop_count }} Loops</span>
                  <span>🎙️ {{ getVoiceShortName(track.voice_id) }}</span>
                </div>

                <!-- Statements Accordion -->
                <div class="affirmations-box">
                  <span class="aff-heading">Spoken Affirmations ({{ track.affirmations.length }}):</span>
                  <ul class="aff-list">
                    @for (stmt of track.affirmations; track $index) {
                      <li>"{{ stmt }}"</li>
                    }
                  </ul>
                </div>
              </div>

              <!-- Card Actions -->
              <div class="card-actions">
                <button 
                  class="btn btn-primary play-btn" 
                  (click)="playTrack(track)"
                >
                  @if (audioPlayer.currentTrack()?.id === track.id && audioPlayer.isPlaying()) {
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
                    <span>Pause</span>
                  } @else {
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    <span>Play Audio</span>
                  }
                </button>

                <button class="btn btn-secondary action-btn" (click)="downloadTrack(track)" title="Download WAV File">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                </button>

                <button class="btn btn-danger action-btn" (click)="deleteTrack(track)" title="Delete Track">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </div>

            </div>
          }
        </div>
      }

    </div>
  `,
  styles: [`
    .library-page {
      padding-top: 32px;
      padding-bottom: 120px;
      display: flex;
      flex-direction: column;
      gap: 28px;
    }
    .library-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .page-title {
      font-size: 2.2rem;
      font-weight: 800;
    }
    .page-subtitle {
      color: var(--text-muted);
    }
    .controls-bar {
      padding: 16px 20px;
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      justify-content: space-between;
      align-items: center;
    }
    .search-box {
      position: relative;
      flex: 1;
      min-width: 280px;
    }
    .search-icon {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-subtle);
    }
    .search-input {
      width: 100%;
      padding: 10px 14px 10px 42px;
      background: rgba(15, 23, 42, 0.8);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sm);
      color: var(--text-main);
      font-size: 0.95rem;
    }
    .search-input:focus {
      outline: none;
      border-color: var(--primary);
    }

    .filter-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .filter-pill {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border-subtle);
      color: var(--text-muted);
      padding: 6px 14px;
      border-radius: var(--radius-full);
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .filter-pill:hover {
      background: rgba(255, 255, 255, 0.1);
      color: var(--text-main);
    }
    .filter-pill.active {
      background: var(--primary);
      border-color: var(--primary);
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
    }
    .filter-pill.favorite-pill.active {
      background: #f43f5e;
      border-color: #f43f5e;
      box-shadow: 0 4px 12px rgba(244, 63, 94, 0.3);
    }

    .tracks-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 24px;
    }
    .track-card {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .track-card.now-playing {
      border-color: var(--cyan);
      box-shadow: 0 0 25px rgba(6, 182, 212, 0.25);
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .badges-row {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .genre-badge {
      font-size: 0.72rem;
      font-weight: 700;
      color: #ffffff;
      padding: 4px 10px;
      border-radius: var(--radius-full);
    }
    .fav-btn {
      background: none;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      opacity: 0.4;
      transition: all 0.2s ease;
    }
    .fav-btn.is-fav {
      opacity: 1;
      transform: scale(1.1);
    }
    .fav-btn:hover {
      opacity: 1;
    }
    .track-title {
      font-size: 1.25rem;
      font-weight: 700;
    }
    .track-meta {
      display: flex;
      gap: 12px;
      font-size: 0.8rem;
      color: var(--text-muted);
      font-weight: 500;
    }
    .affirmations-box {
      background: rgba(0, 0, 0, 0.25);
      border: 1px solid rgba(255, 255, 255, 0.05);
      padding: 12px;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .aff-heading {
      font-size: 0.72rem;
      font-weight: 700;
      color: var(--text-subtle);
      text-transform: uppercase;
    }
    .aff-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 4px;
      max-height: 80px;
      overflow-y: auto;
      font-size: 0.82rem;
      color: var(--text-muted);
      font-style: italic;
    }

    .card-actions {
      display: flex;
      gap: 8px;
      margin-top: auto;
      padding-top: 12px;
      border-top: 1px solid var(--border-subtle);
    }
    .play-btn {
      flex: 1;
    }
    .action-btn {
      padding: 10px;
    }

    .empty-state {
      padding: 64px 24px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }
    .empty-icon { font-size: 3rem; }
    .loading-state {
      padding: 48px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }
    .spinner {
      width: 36px;
      height: 36px;
      border: 3px solid rgba(255, 255, 255, 0.1);
      border-top-color: var(--primary);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    @media (max-width: 768px) {
      .library-header { flex-direction: column; align-items: flex-start; gap: 12px; }
      .tracks-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class TrackLibraryComponent implements OnInit {
  private apiService = inject(ApiService);
  audioPlayer = inject(AudioPlayerService);
  private router = inject(Router);

  tracks = signal<Track[]>([]);
  genres = signal<Genre[]>([]);
  isLoading = signal<boolean>(true);
  
  searchQuery = '';
  selectedGenreFilter = signal<number | null>(null);
  favoritesOnly = signal<boolean>(false);

  filteredTracks = computed(() => {
    let list = this.tracks();
    const query = this.searchQuery.toLowerCase().trim();

    if (query) {
      list = list.filter(t => 
        t.title.toLowerCase().includes(query) ||
        t.affirmations.some(aff => aff.toLowerCase().includes(query))
      );
    }

    return list;
  });

  ngOnInit() {
    this.loadGenres();
    this.loadTracks();
  }

  loadGenres() {
    this.apiService.getGenres().subscribe({
      next: (genres) => this.genres.set(genres)
    });
  }

  loadTracks() {
    this.isLoading.set(true);
    const genreId = this.selectedGenreFilter() ?? undefined;
    const favOnly = this.favoritesOnly();

    this.apiService.getTracks(genreId, favOnly).subscribe({
      next: (res) => {
        this.tracks.set(res.items);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to fetch tracks:', err);
        this.isLoading.set(false);
      }
    });
  }

  setFilter(genreId: number | null, favOnly: boolean) {
    this.selectedGenreFilter.set(genreId);
    this.favoritesOnly.set(favOnly);
    this.loadTracks();
  }

  playTrack(track: Track) {
    this.audioPlayer.playTrack(track);
  }

  toggleFavorite(track: Track, event: MouseEvent) {
    event.stopPropagation();
    this.apiService.toggleFavorite(track.id).subscribe({
      next: (updated) => {
        this.tracks.update(list => list.map(t => t.id === updated.id ? updated : t));
      }
    });
  }

  downloadTrack(track: Track) {
    const url = this.apiService.getTrackStreamUrl(track.id);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${track.title.replace(/\s+/g, '_')}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  deleteTrack(track: Track) {
    if (confirm(`Are you sure you want to delete track "${track.title}"?`)) {
      this.apiService.deleteTrack(track.id).subscribe({
        next: () => {
          this.tracks.update(list => list.filter(t => t.id !== track.id));
        }
      });
    }
  }

  goToGenerator() {
    this.router.navigate(['/generator']);
  }

  formatDuration(secs: number): string {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  getVoiceShortName(voiceId: string): string {
    if (voiceId.includes('Ava')) return 'Ava (Female)';
    if (voiceId.includes('Andrew')) return 'Andrew (Male)';
    if (voiceId.includes('Emma')) return 'Emma (Female)';
    if (voiceId.includes('Sonia')) return 'Sonia (UK)';
    if (voiceId.includes('William')) return 'William (AU)';
    return 'Neural Voice';
  }
}
