import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { LanguageService } from '../../services/language.service';
import { AuthService } from '../../services/auth.service';
import { Genre } from '../../models/genre.model';
import { BinauralPreset } from '../../models/binaural-preset.model';

@Component({
  selector: 'app-genre-grid',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="genre-grid-page container">
      
      <!-- Hero Section -->
      <section class="hero-section glass-panel">
        <div class="hero-content">
          <div class="badge badge-cyan animate-pulse-slow">
            <span>✨ AI Speech TTS (Hindi & English) + Precision Frequency Waves</span>
          </div>

          @if (langService.isHindi()) {
            <h1 class="hero-title">
              अपने अवचेतन मन को <span class="gradient-text">सकारात्मक संदेशों</span> और न्यूरल वेव्स से सशक्त बनाएं
            </h1>
            <p class="hero-subtitle">
              धन, एकाग्रता, गहरी नींद, शारीरिक संतुलन और स्वास्थ्य के लिए हिंदी एवं अंग्रेजी में टेक्स्ट-टू-स्पीच और द्विकर्णीय तरंगों का अनूठा मिश्रण।
            </p>
          } @else {
            <h1 class="hero-title">
              Harmonize Your Mind with <span class="gradient-text">Subliminal Affirmations</span> & Binaural Beats
            </h1>
            <p class="hero-subtitle">
              Layer custom neural spoken affirmations over precision stereo carrier waves tailored for Wealth, Sleep, Peak Focus, Height Posture, and Cellular Radiance in English and Hindi.
            </p>
          }

          <div class="hero-actions">
            <button class="btn btn-primary btn-lg" (click)="goToGenerator()">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              <span>{{ langService.isHindi() ? 'ऑडियो स्टूडियो खोलें' : 'Open Audio Generator Studio' }}</span>
            </button>
            <button class="btn btn-secondary btn-lg" (click)="scrollToGenres()">
              <span>{{ langService.isHindi() ? 'श्रेणियाँ देखें' : 'Explore Presets' }}</span>
            </button>
          </div>
        </div>
      </section>

      <!-- Binaural Wave Spectrum Guide -->
      <section class="spectrum-section">
        <h2 class="section-title">
          {{ langService.isHindi() ? 'मस्तिष्क तरंग आवृत्ति स्पेक्ट्रम' : 'Brainwave Frequency Spectrum' }}
        </h2>
        <div class="spectrum-grid">
          @for (preset of binauralPresets(); track preset.id) {
            <div class="spectrum-card glass-panel-interactive">
              <div class="preset-header">
                <span class="wave-pill" [class]="preset.wave_type.toLowerCase()">{{ preset.wave_type }}</span>
                <span class="freq-tag">{{ preset.beat_frequency }} Hz</span>
              </div>
              <h3 class="preset-name">{{ preset.name }}</h3>
              <p class="preset-desc">{{ preset.description }}</p>
              <div class="preset-footer">
                <span class="recommended-text">💡 {{ preset.recommended_use }}</span>
              </div>
            </div>
          }
        </div>
      </section>

      <!-- Affirmation Genres Grid -->
      <section id="genres-section" class="genres-section">
        <div class="section-header">
          <div>
            <h2 class="section-title">
              {{ langService.isHindi() ? 'सकारात्मक संदेश श्रेणियां (Affirmation Genres)' : 'Affirmation Genres & Quick Start Templates' }}
            </h2>
            <p class="section-subtitle">
              {{ langService.isHindi() ? 'अपने अनुसार श्रेणी चुनें और स्टूडियो में स्वचालित संदेश लोड करें।' : 'Select a category to prefill your audio generator studio with curated statements.' }}
            </p>
          </div>
        </div>

        @if (isLoading()) {
          <div class="loading-state glass-panel">
            <div class="spinner"></div>
            <p>Loading Affirmation Genres...</p>
          </div>
        } @else {
          <div class="genre-cards-grid">
            @for (genre of genres(); track genre.id) {
              <div class="genre-card glass-panel-interactive" (click)="selectGenre(genre)">
                <div class="card-gradient-bar" [style.background]="genre.gradient"></div>
                <div class="card-body">
                  <div class="genre-icon-wrap" [style.background]="genre.gradient">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m10 15 5-3-5-3v6z"/></svg>
                  </div>
                  <h3 class="genre-title">
                    {{ langService.isHindi() && genre.hindi_title ? genre.hindi_title : genre.title }}
                  </h3>
                  <p class="genre-desc">
                    {{ langService.isHindi() && genre.hindi_description ? genre.hindi_description : genre.description }}
                  </p>

                  <div class="sample-affirmations">
                    <span class="sample-label">
                      {{ langService.isHindi() ? 'उदाहरण संदेश:' : 'Sample Statements:' }}
                    </span>
                    <ul>
                      @if (langService.isHindi() && genre.hindi_affirmations) {
                        @for (aff of genre.hindi_affirmations.slice(0, 2); track $index) {
                          <li>"{{ aff }}"</li>
                        }
                      } @else {
                        @for (aff of genre.default_affirmations.slice(0, 2); track $index) {
                          <li>"{{ aff }}"</li>
                        }
                      }
                    </ul>
                  </div>

                  <button class="btn btn-primary btn-block card-btn">
                    <span>{{ langService.isHindi() ? 'क्विक स्टार्ट स्टूडियो' : 'Quick Start Studio' }}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </button>
                </div>
              </div>
            }
          </div>
        }
      </section>

    </div>
  `,
  styles: [`
    .genre-grid-page {
      padding-top: 32px;
      padding-bottom: 120px;
      display: flex;
      flex-direction: column;
      gap: 48px;
    }
    .hero-section {
      padding: 48px 36px;
      text-align: center;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(6, 182, 212, 0.08));
      border: 1px solid rgba(99, 102, 241, 0.2);
    }
    .hero-content {
      max-width: 800px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
    }
    .hero-title {
      font-size: 2.75rem;
      line-height: 1.25;
      font-weight: 800;
    }
    .gradient-text {
      background: linear-gradient(135deg, #38bdf8, #a855f7);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .hero-subtitle {
      font-size: 1.1rem;
      color: var(--text-muted);
      line-height: 1.6;
    }
    .hero-actions {
      display: flex;
      gap: 16px;
      margin-top: 12px;
    }
    .btn-lg {
      padding: 14px 28px;
      font-size: 1.05rem;
      border-radius: 12px;
    }
    
    .section-title {
      font-size: 1.6rem;
      margin-bottom: 8px;
    }
    .section-subtitle {
      color: var(--text-muted);
      margin-bottom: 24px;
    }

    /* Binaural Spectrum Cards */
    .spectrum-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin-top: 16px;
    }
    .spectrum-card {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .preset-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .wave-pill {
      font-size: 0.75rem;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: var(--radius-full);
      text-transform: uppercase;
    }
    .wave-pill.delta { background: rgba(99, 102, 241, 0.2); color: #818cf8; }
    .wave-pill.theta { background: rgba(168, 85, 247, 0.2); color: #c084fc; }
    .wave-pill.alpha { background: rgba(6, 182, 212, 0.2); color: #38bdf8; }
    .wave-pill.beta { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }
    .wave-pill.gamma { background: rgba(244, 63, 94, 0.2); color: #fb7185; }

    .freq-tag {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--text-main);
    }
    .preset-name {
      font-size: 1.1rem;
      font-weight: 700;
    }
    .preset-desc {
      font-size: 0.85rem;
      color: var(--text-muted);
      line-height: 1.4;
    }
    .preset-footer {
      margin-top: auto;
      font-size: 0.78rem;
      color: var(--text-subtle);
    }

    /* Genres Cards Grid */
    .genre-cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 24px;
    }
    .genre-card {
      overflow: hidden;
      display: flex;
      flex-direction: column;
      cursor: pointer;
    }
    .card-gradient-bar {
      height: 6px;
      width: 100%;
    }
    .card-body {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      flex: 1;
    }
    .genre-icon-wrap {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
    .genre-title {
      font-size: 1.3rem;
      font-weight: 700;
    }
    .genre-desc {
      font-size: 0.9rem;
      color: var(--text-muted);
      line-height: 1.5;
    }
    .sample-affirmations {
      background: rgba(0, 0, 0, 0.2);
      padding: 12px 14px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.05);
      font-size: 0.82rem;
    }
    .sample-label {
      font-weight: 700;
      color: var(--text-subtle);
      display: block;
      margin-bottom: 6px;
      text-transform: uppercase;
      font-size: 0.7rem;
      letter-spacing: 0.05em;
    }
    .sample-affirmations ul {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .sample-affirmations li {
      color: var(--text-muted);
      font-style: italic;
    }
    .btn-block {
      width: 100%;
      margin-top: auto;
    }

    .loading-state {
      padding: 48px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      color: var(--text-muted);
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
      .hero-title { font-size: 2rem; }
      .hero-actions { flex-direction: column; width: 100%; }
      .btn-lg { width: 100%; }
      .genre-cards-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class GenreGridComponent implements OnInit {
  private apiService = inject(ApiService);
  langService = inject(LanguageService);
  authService = inject(AuthService);
  private router = inject(Router);

  genres = signal<Genre[]>([]);
  binauralPresets = signal<BinauralPreset[]>([]);
  isLoading = signal<boolean>(true);

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.isLoading.set(true);
    this.apiService.getGenres().subscribe({
      next: (genres) => {
        this.genres.set(genres);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load genres:', err);
        this.isLoading.set(false);
      }
    });

    this.apiService.getBinauralPresets().subscribe({
      next: (presets) => this.binauralPresets.set(presets),
      error: (err) => console.error('Failed to load presets:', err)
    });
  }

  selectGenre(genre: Genre) {
    if (this.authService.requireAuth()) {
      this.router.navigate(['/generator'], { queryParams: { genre_id: genre.id } });
    }
  }

  goToGenerator() {
    if (this.authService.requireAuth()) {
      this.router.navigate(['/generator']);
    }
  }

  scrollToGenres() {
    const el = document.getElementById('genres-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  }
}
