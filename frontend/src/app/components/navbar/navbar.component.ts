import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AudioPlayerService } from '../../services/audio-player.service';
import { LanguageService } from '../../services/language.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="navbar-header glass-panel">
      <div class="container navbar-container">
        
        <!-- Left: macOS Window Traffic Light Controls & Brand -->
        <div class="brand-group">
          <div class="mac-window-controls">
            <span class="mac-dot mac-dot-red"></span>
            <span class="mac-dot mac-dot-yellow"></span>
            <span class="mac-dot mac-dot-green"></span>
          </div>

          <a routerLink="/" class="brand-link" title="MindHarmonics Studio">
            <div class="brand-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2 10v3"/><path d="M6 6v11"/><path d="M10 3v18"/><path d="M14 8v7"/><path d="M18 5v13"/><path d="M22 10v3"/>
              </svg>
            </div>
            <span class="brand-name">Mind<span class="text-gradient">Harmonics</span></span>
          </a>
        </div>

        <!-- Center: Liquid Glass Nav Pills -->
        <nav class="nav-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
            <span>{{ langService.isHindi() ? 'श्रेणियाँ' : 'Explore' }}</span>
          </a>

          <a routerLink="/generator" routerLinkActive="active" class="nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            <span>{{ langService.isHindi() ? 'स्टूडियो' : 'Studio' }}</span>
          </a>

          <a routerLink="/library" routerLinkActive="active" class="nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/></svg>
            <span>{{ langService.isHindi() ? 'लाइब्रेरी' : 'Library' }}</span>
          </a>

          <a routerLink="/suggestions" routerLinkActive="active" class="nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
            <span>{{ langService.isHindi() ? 'सुझाव' : 'Books' }}</span>
          </a>
        </nav>

        <!-- Right Side: macOS Controls -->
        <div class="right-controls">
          
          <!-- Theme Toggle -->
          <button class="icon-btn" (click)="themeService.toggleTheme()" [title]="themeService.isDark() ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
            {{ themeService.isDark() ? '🌙' : '☀️' }}
          </button>

          <!-- Language Toggle -->
          <button class="lang-btn" (click)="langService.toggleLanguage()" [title]="langService.isHindi() ? 'Switch to English' : 'हिंदी में बदलें'">
            <span>{{ langService.currentLang() === 'en' ? '🇬🇧 EN' : '🇮🇳 HI' }}</span>
          </button>

        </div>

      </div>
    </header>
  `,
  styles: [`
    .navbar-header {
      position: sticky;
      top: 0;
      z-index: 100;
      border-radius: 0 0 20px 20px;
      border-top: none;
      background: var(--bg-card);
      backdrop-filter: blur(28px) saturate(190%);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }
    .navbar-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 64px;
      padding: 0 24px;
    }

    .brand-group {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .brand-link {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      color: inherit;
    }
    .brand-icon {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: linear-gradient(135deg, #6366f1, #06b6d4);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.4), 0 0 16px rgba(99, 102, 241, 0.4);
    }
    .brand-name {
      font-family: var(--font-heading);
      font-size: 1.2rem;
      font-weight: 800;
      color: var(--text-main);
      letter-spacing: -0.02em;
      white-space: nowrap;
    }
    .text-gradient {
      background: linear-gradient(135deg, #38bdf8, #818cf8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    /* macOS Central Liquid Glass Nav Pills */
    .nav-links {
      display: flex;
      align-items: center;
      gap: 4px;
      background: rgba(255, 255, 255, 0.06);
      backdrop-filter: blur(16px);
      padding: 4px;
      border-radius: var(--radius-full);
      border: 1px solid var(--border-subtle);
      border-top-color: var(--border-specular);
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: var(--radius-full);
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-muted);
      text-decoration: none;
      white-space: nowrap;
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .nav-item:hover {
      color: var(--text-main);
      background: rgba(255, 255, 255, 0.12);
    }
    .nav-item.active {
      color: #ffffff;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.85), rgba(6, 182, 212, 0.85));
      border: 1px solid rgba(255, 255, 255, 0.3);
      box-shadow: 0 4px 15px rgba(99, 102, 241, 0.35);
    }

    /* Right Controls */
    .right-controls {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .icon-btn {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid var(--border-subtle);
      border-top-color: var(--border-specular);
      color: var(--text-main);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.25s ease;
    }
    .icon-btn:hover {
      background: rgba(255, 255, 255, 0.18);
      transform: scale(1.06);
    }
    .lang-btn {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid var(--border-subtle);
      border-top-color: var(--border-specular);
      color: var(--text-main);
      padding: 6px 12px;
      border-radius: var(--radius-full);
      font-size: 0.8rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.25s ease;
    }
    .lang-btn:hover {
      background: rgba(255, 255, 255, 0.18);
      border-color: var(--primary);
    }

    @media (max-width: 860px) {
      .navbar-container { padding: 0 16px; }
      .nav-item span { display: none; }
      .mac-window-controls { display: none; }
    }
  `]
})
export class NavbarComponent {
  audioPlayer = inject(AudioPlayerService);
  langService = inject(LanguageService);
  themeService = inject(ThemeService);
}
