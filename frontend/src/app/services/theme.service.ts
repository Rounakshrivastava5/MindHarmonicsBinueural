import { Injectable, signal } from '@angular/core';

export type Theme = 'dark' | 'light';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  readonly currentTheme = signal<Theme>('dark');

  constructor() {
    const saved = localStorage.getItem('mindharmonics_theme') as Theme | null;
    if (saved === 'light' || saved === 'dark') {
      this.setTheme(saved);
    } else {
      this.setTheme('dark');
    }
  }

  setTheme(theme: Theme) {
    this.currentTheme.set(theme);
    localStorage.setItem('mindharmonics_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
  }

  toggleTheme() {
    const next = this.currentTheme() === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
  }

  isDark(): boolean {
    return this.currentTheme() === 'dark';
  }
}
