import { Injectable, signal } from '@angular/core';

export type Language = 'en' | 'hi';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  readonly currentLang = signal<Language>('en');

  setLanguage(lang: Language) {
    this.currentLang.set(lang);
  }

  toggleLanguage() {
    this.currentLang.set(this.currentLang() === 'en' ? 'hi' : 'en');
  }

  isHindi(): boolean {
    return this.currentLang() === 'hi';
  }
}
