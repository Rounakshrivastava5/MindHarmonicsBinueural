import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AudioPlayerService } from '../../services/audio-player.service';
import { LanguageService } from '../../services/language.service';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="navbar-header glass-panel">
      <div class="container navbar-container">
        
        <!-- Brand Logo -->
        <a routerLink="/" class="brand-link" title="MindHarmonics Studio">
          <div class="brand-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 10v3"/><path d="M6 6v11"/><path d="M10 3v18"/><path d="M14 8v7"/><path d="M18 5v13"/><path d="M22 10v3"/>
            </svg>
          </div>
          <span class="brand-name">Mind<span class="text-gradient">Harmonics</span></span>
        </a>

        <!-- Navigation Tabs -->
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

        <!-- Right Side Quick Controls & Auth -->
        <div class="right-controls">
          
          <!-- Theme Toggle -->
          <button class="icon-btn" (click)="themeService.toggleTheme()" [title]="themeService.isDark() ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
            {{ themeService.isDark() ? '🌙' : '☀️' }}
          </button>

          <!-- Language Toggle -->
          <button class="lang-btn" (click)="langService.toggleLanguage()" [title]="langService.isHindi() ? 'Switch to English' : 'हिंदी में बदलें'">
            <span>{{ langService.currentLang() === 'en' ? '🇬🇧 EN' : '🇮🇳 HI' }}</span>
          </button>

          <!-- Auth Account Bar -->
          @if (authService.isLoggedIn(); as loggedIn) {
            <div class="user-chip" [title]="authService.currentUser()?.email">
              <span class="user-avatar">👤</span>
              <span class="user-name">{{ getUserDisplayName() }}</span>
              <button class="logout-icon-btn" (click)="authService.logout()" title="Logout">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              </button>
            </div>
          } @else {
            <button class="btn btn-primary btn-sm login-btn" (click)="authService.openAuthModal()">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
              <span>{{ langService.isHindi() ? 'साइन इन' : 'Sign In' }}</span>
            </button>
          }

        </div>

      </div>
    </header>
  `,
  styles: [`
    .navbar-header {
      position: sticky;
      top: 0;
      z-index: 100;
      border-radius: 0 0 16px 16px;
      border-top: none;
      border-left: none;
      border-right: none;
      background: var(--bg-card);
      backdrop-filter: blur(20px);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
    .navbar-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 64px;
      padding: 0 24px;
    }

    /* Brand Logo */
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
      box-shadow: 0 0 14px rgba(99, 102, 241, 0.35);
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

    /* Central Nav Tabs */
    .nav-links {
      display: flex;
      align-items: center;
      gap: 4px;
      background: rgba(100, 116, 139, 0.08);
      padding: 4px;
      border-radius: var(--radius-full);
      border: 1px solid var(--border-subtle);
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
      transition: all 0.2s ease;
    }
    .nav-item:hover {
      color: var(--text-main);
      background: rgba(100, 116, 139, 0.12);
    }
    .nav-item.active {
      color: #ffffff;
      background: linear-gradient(135deg, #6366f1, #06b6d4);
      box-shadow: 0 2px 10px rgba(99, 102, 241, 0.3);
    }

    /* Right Side Controls */
    .right-controls {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .icon-btn {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: rgba(100, 116, 139, 0.1);
      border: 1px solid var(--border-subtle);
      color: var(--text-main);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .icon-btn:hover {
      background: rgba(100, 116, 139, 0.2);
      transform: scale(1.05);
    }
    .lang-btn {
      background: rgba(100, 116, 139, 0.1);
      border: 1px solid var(--border-subtle);
      color: var(--text-main);
      padding: 6px 12px;
      border-radius: var(--radius-full);
      font-size: 0.8rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .lang-btn:hover {
      background: rgba(100, 116, 139, 0.2);
      border-color: var(--primary);
    }

    /* User Account Chip */
    .user-chip {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(99, 102, 241, 0.12);
      border: 1px solid rgba(99, 102, 241, 0.25);
      padding: 4px 10px;
      border-radius: var(--radius-full);
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--text-main);
    }
    .user-avatar {
      font-size: 0.85rem;
    }
    .user-name {
      max-width: 100px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .logout-icon-btn {
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      display: flex;
      align-items: center;
      padding: 2px;
      border-radius: 4px;
      transition: color 0.2s ease;
    }
    .logout-icon-btn:hover {
      color: #f43f5e;
    }

    .login-btn {
      padding: 6px 14px;
      font-size: 0.82rem;
      border-radius: var(--radius-full);
    }

    @media (max-width: 860px) {
      .navbar-container {
        padding: 0 16px;
      }
      .nav-item span {
        display: none;
      }
      .user-name {
        display: none;
      }
    }
  `]
})
export class NavbarComponent {
  audioPlayer = inject(AudioPlayerService);
  langService = inject(LanguageService);
  themeService = inject(ThemeService);
  authService = inject(AuthService);

  getUserDisplayName(): string {
    const user = this.authService.currentUser();
    if (!user) return '';
    if (user.full_name) {
      return user.full_name.split(' ')[0];
    }
    return user.email.split('@')[0];
  }
}
