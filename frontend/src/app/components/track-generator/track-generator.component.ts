import { Component, OnInit, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AudioPlayerService } from '../../services/audio-player.service';
import { LanguageService } from '../../services/language.service';
import { Genre } from '../../models/genre.model';
import { BinauralPreset } from '../../models/binaural-preset.model';
import { Voice } from '../../models/voice.model';
import { TrackCreate } from '../../models/track.model';
import { WaveVisualizerComponent } from '../wave-visualizer/wave-visualizer.component';

@Component({
  selector: 'app-track-generator',
  standalone: true,
  imports: [CommonModule, FormsModule, WaveVisualizerComponent],
  template: `
    <div class="generator-page container">
      
      <!-- Studio Header -->
      <div class="studio-header">
        <div>
          <span class="badge badge-violet mb-2">🎛️ {{ langService.isHindi() ? 'ऑडियो निर्माण स्टूडियो' : 'MindHarmonics Studio' }}</span>
          <h1 class="page-title">
            {{ langService.isHindi() ? 'कस्टम एफर्मेशन और द्विकर्णीय ट्रैक बनाएं' : 'Synthesize Custom Affirmation Track' }}
          </h1>
          <p class="page-subtitle">
            {{ langService.isHindi() ? 'अपनी पसंद की भाषा (हिंदी/अंग्रेजी), तंत्रिका स्वर (Voice), आवृत्ति और संदेश चुनें।' : 'Configure your binaural beat frequencies, text-to-speech voice, and affirmation statements.' }}
          </p>
        </div>
      </div>

      <div class="studio-layout">
        
        <!-- Left Column: Form Configuration -->
        <div class="form-column glass-panel">
          
          <!-- Step 1: Track Details & Language / Genre -->
          <div class="form-section">
            <div class="section-heading-row">
              <h3 class="section-heading">1. {{ langService.isHindi() ? 'भाषा एवं श्रेणी' : 'Track Info & Category' }}</h3>
              
              <div class="lang-selector-pills">
                <button 
                  type="button" 
                  class="lang-pill" 
                  [class.active]="langService.currentLang() === 'en'"
                  (click)="setStudioLanguage('en')"
                >
                  🇬🇧 English
                </button>
                <button 
                  type="button" 
                  class="lang-pill" 
                  [class.active]="langService.currentLang() === 'hi'"
                  (click)="setStudioLanguage('hi')"
                >
                  🇮🇳 हिन्दी
                </button>
              </div>
            </div>
            
            <div class="form-group">
              <label class="form-label">{{ langService.isHindi() ? 'ट्रैक का शीर्षक (Title)' : 'Track Title' }}</label>
              <input type="text" [(ngModel)]="trackTitle" class="form-input" [placeholder]="langService.isHindi() ? 'उदा. धन और सफलता प्राइमिंग' : 'e.g. My Morning Wealth Priming'">
            </div>

            <div class="form-group">
              <label class="form-label">{{ langService.isHindi() ? 'एफर्मेशन श्रेणी (Genre)' : 'Affirmation Genre' }}</label>
              <select [(ngModel)]="selectedGenreId" (change)="onGenreChange()" class="form-select">
                @for (genre of genres(); track genre.id) {
                  <option [value]="genre.id">
                    {{ langService.isHindi() && genre.hindi_title ? genre.hindi_title : genre.title }}
                  </option>
                }
              </select>
            </div>
          </div>

          <!-- Step 2: Affirmations List Editor -->
          <div class="form-section">
            <div class="section-heading-row">
              <h3 class="section-heading">2. {{ langService.isHindi() ? 'सकारात्मक संदेश (Affirmation Statements)' : 'Affirmation Statements' }}</h3>
              <button class="btn btn-secondary btn-sm" (click)="loadGenreDefaults()">
                ⚡ {{ langService.isHindi() ? 'डिफ़ॉल्ट संदेश लोड करें' : 'Load Preset Affirmations' }}
              </button>
            </div>

            <div class="statements-list">
              @for (aff of affirmations(); track $index) {
                <div class="statement-item">
                  <span class="item-number">{{ $index + 1 }}</span>
                  <input 
                    type="text" 
                    [value]="aff" 
                    (input)="updateAffirmation($index, $any($event.target).value)" 
                    class="form-input" 
                    [placeholder]="langService.isHindi() ? 'सकारात्मक संदेश यहाँ लिखें...' : 'Enter empowering affirmation statement...'"
                  >
                  @if (affirmations().length > 1) {
                    <button class="btn btn-danger btn-icon" (click)="removeAffirmation($index)" title="Remove">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    </button>
                  }
                </div>
              }
            </div>

            <button class="btn btn-secondary btn-sm add-btn" (click)="addAffirmation()">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="M12 5v19"/></svg>
              <span>{{ langService.isHindi() ? 'नया संदेश जोड़ें' : 'Add Statement' }}</span>
            </button>
          </div>

          <!-- Step 3: Binaural Frequency Tuner -->
          <div class="form-section">
            <h3 class="section-heading">3. {{ langService.isHindi() ? 'द्विकर्णीय तरंग (Binaural Frequency Preset)' : 'Binaural Frequency Wave Preset' }}</h3>
            
            <div class="presets-row">
              @for (preset of binauralPresets(); track preset.id) {
                <button 
                  type="button"
                  class="preset-chip" 
                  [class.selected]="selectedPresetId === preset.id"
                  (click)="selectBinauralPreset(preset)"
                >
                  <span class="chip-name">{{ preset.name }}</span>
                  <span class="chip-hz">{{ preset.beat_frequency }}Hz</span>
                </button>
              }
            </div>

            <div class="tuners-grid">
              <div class="form-group">
                <div class="slider-label-row">
                  <span class="form-label">Beat Frequency (Hz)</span>
                  <span class="val-tag">{{ beatFreq }} Hz</span>
                </div>
                <input type="range" min="0.5" max="40.0" step="0.5" [(ngModel)]="beatFreq">
                <span class="help-text">Delta 0.5-4Hz, Theta 4-8Hz, Alpha 8-13Hz, Beta 13-30Hz, Gamma 30-40Hz</span>
              </div>

              <div class="form-group">
                <div class="slider-label-row">
                  <span class="form-label">Base Carrier Frequency (Hz)</span>
                  <span class="val-tag">{{ carrierFreq }} Hz</span>
                </div>
                <input type="range" min="100" max="528" step="1" [(ngModel)]="carrierFreq">
                <span class="help-text">Base carrier pitch (e.g. 216Hz, Solfeggio 432Hz, 528Hz Transformation Tone)</span>
              </div>
            </div>
          </div>

          <!-- Step 4: Voice & Audio Mixer Ratios -->
          <div class="form-section">
            <h3 class="section-heading">4. {{ langService.isHindi() ? 'न्यूरल वॉइस एवं ऑडियो मिक्सर' : 'Neural Voice & Audio Mixer Ratios' }}</h3>

            <div class="form-group">
              <label class="form-label">{{ langService.isHindi() ? 'टेक्स्ट-टू-स्पीच स्वर (TTS Voice)' : 'Text-to-Speech Voice' }}</label>
              <select [(ngModel)]="selectedVoiceId" class="form-select">
                @for (voice of voices(); track voice.id) {
                  <option [value]="voice.id">
                    {{ voice.name }}
                  </option>
                }
              </select>
            </div>

            <div class="mixer-sliders">
              <div class="form-group">
                <div class="slider-label-row">
                  <span class="form-label">🗣️ {{ langService.isHindi() ? 'आवाज (Speech) की मात्रा' : 'Speech Volume Ratio' }}</span>
                  <span class="val-tag">{{ (speechVol * 100) | number:'1.0-0' }}%</span>
                </div>
                <input type="range" min="0.0" max="1.0" step="0.05" [(ngModel)]="speechVol">
              </div>

              <div class="form-group">
                <div class="slider-label-row">
                  <span class="form-label">🌊 {{ langService.isHindi() ? 'द्विकर्णीय तरंगों की मात्रा' : 'Binaural Beats Volume Ratio' }}</span>
                  <span class="val-tag">{{ (binauralVol * 100) | number:'1.0-0' }}%</span>
                </div>
                <input type="range" min="0.0" max="1.0" step="0.05" [(ngModel)]="binauralVol">
              </div>

              <div class="form-group">
                <div class="slider-label-row">
                  <span class="form-label">🔁 {{ langService.isHindi() ? 'पुनरावृत्ति (Loop Count)' : 'Loop Repeat Count' }}</span>
                  <span class="val-tag">{{ loopCount }} Loops</span>
                </div>
                <input type="range" min="1" max="10" step="1" [(ngModel)]="loopCount">
              </div>
            </div>
          </div>

          <!-- Generate Action Button -->
          <div class="submit-wrap">
            <button 
              class="btn btn-primary btn-submit" 
              [disabled]="isGenerating() || affirmations().length === 0"
              (click)="generateTrack()"
            >
              @if (isGenerating()) {
                <div class="spinner-sm"></div>
                <span>{{ langService.isHindi() ? 'ऑडियो तैयार हो रहा है...' : 'Synthesizing Track...' }}</span>
              } @else {
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3z"/></svg>
                <span>{{ langService.isHindi() ? 'ऑडियो ट्रैक बनाएं (Generate Track)' : 'Generate Composite Audio Track' }}</span>
              }
            </button>

            @if (errorMessage()) {
              <div class="error-banner">
                ⚠️ {{ errorMessage() }}
              </div>
            }
          </div>

        </div>

        <!-- Right Column: Live Visualizer & Studio Preview Card -->
        <div class="preview-column">
          <div class="glass-panel sticky-card">
            <h3 class="preview-title">
              {{ langService.isHindi() ? 'लाइव तरंग पूर्वावलोकन (Preview)' : 'Live Frequency Wave Preview' }}
            </h3>
            
            <div class="visualizer-box">
              <app-wave-visualizer 
                [isPlaying]="true" 
                [beatFreq]="beatFreq"
                primaryColor="#6366f1"
                secondaryColor="#06b6d4"
              ></app-wave-visualizer>
            </div>

            <div class="summary-details">
              <div class="summary-row">
                <span class="s-label">Language:</span>
                <span class="s-val badge badge-emerald">{{ langService.currentLang() === 'hi' ? '🇮🇳 Hindi' : '🇬🇧 English' }}</span>
              </div>
              <div class="summary-row">
                <span class="s-label">Category:</span>
                <span class="s-val">{{ getSelectedGenreTitle() }}</span>
              </div>
              <div class="summary-row">
                <span class="s-label">Target Wave:</span>
                <span class="s-val badge badge-cyan">{{ beatFreq }} Hz Beat</span>
              </div>
              <div class="summary-row">
                <span class="s-label">Base Carrier:</span>
                <span class="s-val">{{ carrierFreq }} Hz</span>
              </div>
              <div class="summary-row">
                <span class="s-label">Total Statements:</span>
                <span class="s-val">{{ affirmations().length }} Statements</span>
              </div>
              <div class="summary-row">
                <span class="s-label">Voice:</span>
                <span class="s-val">{{ getSelectedVoiceName() }}</span>
              </div>
            </div>

            <div class="preview-tip">
              💡 <strong>{{ langService.isHindi() ? 'स्टीरियो हेडफोन आवश्यक है:' : 'Stereo Headphones Required:' }}</strong> 
              {{ langService.isHindi() ? 'द्विकर्णीय तरंगें (Binaural Beats) बाएं और दाएं कानों में अलग-अलग आवृत्तियां भेजकर मस्तिष्क को शांत और केंद्रित करती हैं।' : 'Binaural beats function by outputting slightly different carrier frequencies to your left and right ear to naturally sync your brainwaves.' }}
            </div>
          </div>
        </div>

      </div>

    </div>
  `,
  styles: [`
    .generator-page {
      padding-top: 32px;
      padding-bottom: 120px;
    }
    .studio-header {
      margin-bottom: 28px;
    }
    .page-title {
      font-size: 2.2rem;
      font-weight: 800;
    }
    .page-subtitle {
      color: var(--text-muted);
      font-size: 1rem;
    }
    .studio-layout {
      display: grid;
      grid-template-columns: 1fr 340px;
      gap: 28px;
      align-items: start;
    }
    .form-column {
      padding: 32px;
      display: flex;
      flex-direction: column;
      gap: 32px;
    }
    .form-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding-bottom: 24px;
      border-bottom: 1px solid var(--border-subtle);
    }
    .form-section:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
    .section-heading {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--text-main);
    }
    .section-heading-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
    }
    .lang-selector-pills {
      display: flex;
      gap: 6px;
      background: rgba(0, 0, 0, 0.3);
      padding: 4px;
      border-radius: var(--radius-full);
      border: 1px solid var(--border-subtle);
    }
    .lang-pill {
      background: none;
      border: none;
      color: var(--text-muted);
      padding: 6px 12px;
      border-radius: var(--radius-full);
      font-size: 0.8rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .lang-pill.active {
      background: var(--primary);
      color: #ffffff;
    }

    .statements-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .statement-item {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .item-number {
      font-weight: 700;
      color: var(--text-subtle);
      width: 24px;
      text-align: center;
    }
    .btn-icon {
      padding: 10px;
      border-radius: var(--radius-sm);
    }
    .add-btn {
      align-self: flex-start;
    }
    .presets-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .preset-chip {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-subtle);
      padding: 8px 14px;
      border-radius: var(--radius-full);
      color: var(--text-muted);
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      gap: 6px;
      transition: all 0.2s ease;
    }
    .preset-chip:hover {
      background: rgba(255, 255, 255, 0.1);
      color: var(--text-main);
    }
    .preset-chip.selected {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(6, 182, 212, 0.3));
      border-color: var(--cyan);
      color: #ffffff;
    }
    .chip-hz {
      color: var(--cyan);
    }
    .tuners-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-top: 12px;
    }
    .slider-label-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.85rem;
    }
    .val-tag {
      font-weight: 700;
      color: var(--cyan);
    }
    .help-text {
      font-size: 0.75rem;
      color: var(--text-subtle);
    }
    .mixer-sliders {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .submit-wrap {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .btn-submit {
      width: 100%;
      padding: 16px;
      font-size: 1.1rem;
      border-radius: 12px;
    }
    .spinner-sm {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: #ffffff;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .error-banner {
      background: rgba(244, 63, 94, 0.15);
      border: 1px solid rgba(244, 63, 94, 0.3);
      color: #f43f5e;
      padding: 12px;
      border-radius: 8px;
      font-size: 0.9rem;
      text-align: center;
    }

    /* Right Column Card */
    .sticky-card {
      position: sticky;
      top: 92px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .preview-title {
      font-size: 1.15rem;
    }
    .visualizer-box {
      height: 120px;
      border-radius: 12px;
      overflow: hidden;
    }
    .summary-details {
      display: flex;
      flex-direction: column;
      gap: 10px;
      font-size: 0.88rem;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px dashed rgba(255, 255, 255, 0.08);
      padding-bottom: 6px;
    }
    .s-label { color: var(--text-muted); }
    .s-val { font-weight: 600; }
    .preview-tip {
      background: rgba(6, 182, 212, 0.08);
      border: 1px solid rgba(6, 182, 212, 0.2);
      padding: 12px;
      border-radius: 8px;
      font-size: 0.8rem;
      color: var(--text-muted);
      line-height: 1.4;
    }

    @media (max-width: 900px) {
      .studio-layout { grid-template-columns: 1fr; }
      .sticky-card { position: static; }
      .tuners-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class TrackGeneratorComponent implements OnInit {
  private apiService = inject(ApiService);
  private audioPlayer = inject(AudioPlayerService);
  langService = inject(LanguageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  genres = signal<Genre[]>([]);
  binauralPresets = signal<BinauralPreset[]>([]);
  voices = signal<Voice[]>([]);
  
  affirmations = signal<string[]>(['']);
  
  trackTitle = '';
  selectedGenreId = 1;
  selectedPresetId = 3;
  selectedVoiceId = 'en-US-AvaNeural';

  beatFreq = 10.0;
  carrierFreq = 256.0;
  speechVol = 0.8;
  binauralVol = 0.5;
  loopCount = 3;

  isGenerating = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  constructor() {
    // Watch for global language changes
    effect(() => {
      const current = this.langService.currentLang();
      this.autoSelectVoiceForLanguage(current);
      if (this.genres().length > 0) {
        this.loadGenreDefaults();
      }
    });
  }

  ngOnInit() {
    this.fetchFormOptions();
  }

  fetchFormOptions() {
    this.apiService.getGenres().subscribe({
      next: (genres) => {
        this.genres.set(genres);
        this.route.queryParams.subscribe(params => {
          if (params['genre_id']) {
            const gId = parseInt(params['genre_id'], 10);
            const found = genres.find(g => g.id === gId);
            if (found) {
              this.selectedGenreId = found.id;
              this.loadGenreDefaults();
            }
          } else if (genres.length > 0) {
            this.selectedGenreId = genres[0].id;
            this.loadGenreDefaults();
          }
        });
      }
    });

    this.apiService.getBinauralPresets().subscribe({
      next: (presets) => {
        this.binauralPresets.set(presets);
        if (presets.length > 0) {
          const alpha = presets.find(p => p.wave_type === 'Alpha') || presets[0];
          this.selectBinauralPreset(alpha);
        }
      }
    });

    this.apiService.getVoices().subscribe({
      next: (voices) => {
        this.voices.set(voices);
        this.autoSelectVoiceForLanguage(this.langService.currentLang());
      }
    });
  }

  setStudioLanguage(lang: 'en' | 'hi') {
    this.langService.setLanguage(lang);
  }

  autoSelectVoiceForLanguage(lang: 'en' | 'hi') {
    if (lang === 'hi') {
      const hiVoice = this.voices().find(v => v.locale.includes('hi') || v.id.includes('hi-IN'));
      if (hiVoice) {
        this.selectedVoiceId = hiVoice.id;
      }
    } else {
      const enVoice = this.voices().find(v => v.id === 'en-US-AvaNeural') || this.voices()[0];
      if (enVoice) {
        this.selectedVoiceId = enVoice.id;
      }
    }
  }

  onGenreChange() {
    this.loadGenreDefaults();
  }

  loadGenreDefaults() {
    const g = this.genres().find(genre => genre.id === Number(this.selectedGenreId));
    if (g) {
      if (this.langService.isHindi()) {
        this.trackTitle = `${g.hindi_title || g.title} सत्र`;
        this.affirmations.set(g.hindi_affirmations && g.hindi_affirmations.length > 0 ? [...g.hindi_affirmations] : [...g.default_affirmations]);
      } else {
        this.trackTitle = `${g.title} Session`;
        this.affirmations.set([...g.default_affirmations]);
      }
    }
  }

  addAffirmation() {
    this.affirmations.update(list => [...list, '']);
  }

  updateAffirmation(index: number, val: string) {
    this.affirmations.update(list => {
      const copy = [...list];
      copy[index] = val;
      return copy;
    });
  }

  removeAffirmation(index: number) {
    this.affirmations.update(list => list.filter((_, i) => i !== index));
  }

  selectBinauralPreset(preset: BinauralPreset) {
    this.selectedPresetId = preset.id;
    this.beatFreq = preset.beat_frequency;
    this.carrierFreq = preset.carrier_frequency;
  }

  generateTrack() {
    const filteredAffirmations = this.affirmations().map(a => a.trim()).filter(a => a.length > 0);
    if (filteredAffirmations.length === 0) {
      this.errorMessage.set(this.langService.isHindi() ? 'कृपया कम से कम एक सकारात्मक संदेश दर्ज करें।' : 'Please enter at least one affirmation statement.');
      return;
    }

    this.isGenerating.set(true);
    this.errorMessage.set(null);

    const payload: TrackCreate = {
      title: this.trackTitle || `${this.getSelectedGenreTitle()} Track`,
      genre_id: Number(this.selectedGenreId),
      binaural_preset_id: Number(this.selectedPresetId),
      affirmations: filteredAffirmations,
      loop_count: Number(this.loopCount),
      speech_volume: Number(this.speechVol),
      binaural_volume: Number(this.binauralVol),
      voice_id: this.selectedVoiceId,
      custom_carrier_freq: Number(this.carrierFreq),
      custom_beat_freq: Number(this.beatFreq)
    };

    this.apiService.generateTrack(payload).subscribe({
      next: (createdTrack) => {
        this.isGenerating.set(false);
        this.audioPlayer.playTrack(createdTrack);
        this.router.navigate(['/library']);
      },
      error: (err) => {
        console.error('Track generation error:', err);
        this.isGenerating.set(false);
        this.errorMessage.set(err.error?.detail || 'Failed to synthesize track. Please check backend connection.');
      }
    });
  }

  getSelectedGenreTitle(): string {
    const g = this.genres().find(genre => genre.id === Number(this.selectedGenreId));
    if (!g) return 'Custom Genre';
    return this.langService.isHindi() && g.hindi_title ? g.hindi_title : g.title;
  }

  getSelectedVoiceName(): string {
    return this.voices().find(v => v.id === this.selectedVoiceId)?.name || 'Default Voice';
  }
}
