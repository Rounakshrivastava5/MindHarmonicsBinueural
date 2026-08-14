import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (authService.isAuthModalOpen()) {
      <div class="modal-backdrop" (click)="authService.closeAuthModal()">
        <div class="modal-card glass-panel" (click)="$event.stopPropagation()">
          
          <button class="close-btn" (click)="authService.closeAuthModal()" title="Close">✕</button>

          <div class="modal-header">
            <div class="brand-badge">
              <span>✉️ {{ langService.isHindi() ? 'ईमेल द्वारा प्रवेश' : 'Email Authentication' }}</span>
            </div>
            <h2 class="modal-title">
              {{ isSignUp() ? (langService.isHindi() ? 'खाता बनाएं' : 'Create an Account') : (langService.isHindi() ? 'साइन इन करें' : 'Sign In to MindHarmonics') }}
            </h2>
            <p class="modal-subtitle">
              {{ langService.isHindi() ? 'अपने ट्रैक सहेजें और किसी भी डिवाइस पर कभी भी सुनें।' : 'Access your saved binaural tracks across any device.' }}
            </p>
          </div>

          <!-- Auth Mode Tabs -->
          <div class="mode-tabs">
            <button 
              type="button" 
              class="tab-btn" 
              [class.active]="!isSignUp()" 
              (click)="setMode(false)"
            >
              {{ langService.isHindi() ? 'लॉग इन (Sign In)' : 'Sign In' }}
            </button>
            <button 
              type="button" 
              class="tab-btn" 
              [class.active]="isSignUp()" 
              (click)="setMode(true)"
            >
              {{ langService.isHindi() ? 'साइन अप (Sign Up)' : 'Sign Up' }}
            </button>
          </div>

          <form (ngSubmit)="onSubmit()" class="auth-form">
            @if (isSignUp()) {
              <div class="form-group">
                <label class="form-label">{{ langService.isHindi() ? 'पूरा नाम (Full Name)' : 'Full Name' }}</label>
                <input 
                  type="text" 
                  [(ngModel)]="fullName" 
                  name="fullName" 
                  class="form-input" 
                  [placeholder]="langService.isHindi() ? 'उदा. राहुल शर्मा' : 'e.g. Alex Mercer'"
                >
              </div>
            }

            <div class="form-group">
              <label class="form-label">{{ langService.isHindi() ? 'ईमेल पता (Email Address)' : 'Email Address' }}</label>
              <input 
                type="email" 
                [(ngModel)]="email" 
                name="email" 
                required 
                class="form-input" 
                placeholder="your.email@domain.com"
              >
            </div>

            <div class="form-group">
              <label class="form-label">{{ langService.isHindi() ? 'पासवर्ड (Password)' : 'Password' }}</label>
              <input 
                type="password" 
                [(ngModel)]="password" 
                name="password" 
                required 
                minlength="6" 
                class="form-input" 
                placeholder="••••••••"
              >
            </div>

            @if (errorMessage()) {
              <div class="error-banner">
                ⚠️ {{ errorMessage() }}
              </div>
            }

            <button type="submit" class="btn btn-primary btn-submit" [disabled]="isLoading()">
              @if (isLoading()) {
                <div class="spinner-sm"></div>
                <span>{{ langService.isHindi() ? 'प्रक्रिया चालू है...' : 'Processing...' }}</span>
              } @else {
                <span>{{ isSignUp() ? (langService.isHindi() ? 'साइन अप करें' : 'Create Account') : (langService.isHindi() ? 'लॉग इन करें' : 'Sign In') }}</span>
              }
            </button>
          </form>

        </div>
      </div>
    }
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      inset: 0;
      z-index: 9999;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .modal-card {
      position: relative;
      width: 100%;
      max-width: 440px;
      padding: 32px;
      background: var(--bg-card);
      border: 1px solid var(--border-highlight);
      box-shadow: var(--shadow-card), 0 0 40px rgba(99, 102, 241, 0.2);
    }
    .close-btn {
      position: absolute;
      top: 16px;
      right: 16px;
      background: none;
      border: none;
      color: var(--text-muted);
      font-size: 1.2rem;
      cursor: pointer;
      padding: 4px;
      transition: color 0.2s;
    }
    .close-btn:hover { color: var(--text-main); }
    .modal-header {
      text-align: center;
      margin-bottom: 24px;
    }
    .brand-badge {
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--cyan);
      margin-bottom: 8px;
    }
    .modal-title {
      font-size: 1.6rem;
      font-weight: 800;
    }
    .modal-subtitle {
      font-size: 0.88rem;
      color: var(--text-muted);
      margin-top: 4px;
    }
    .mode-tabs {
      display: flex;
      background: rgba(100, 116, 139, 0.12);
      padding: 4px;
      border-radius: var(--radius-full);
      margin-bottom: 24px;
      border: 1px solid var(--border-subtle);
    }
    .tab-btn {
      flex: 1;
      background: none;
      border: none;
      color: var(--text-muted);
      padding: 8px;
      border-radius: var(--radius-full);
      font-weight: 700;
      font-size: 0.88rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    .tab-btn.active {
      background: var(--primary);
      color: #ffffff;
    }
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .btn-submit {
      width: 100%;
      padding: 12px;
      font-size: 1rem;
      margin-top: 8px;
    }
    .error-banner {
      background: rgba(244, 63, 94, 0.15);
      border: 1px solid rgba(244, 63, 94, 0.3);
      color: #f43f5e;
      padding: 10px;
      border-radius: 8px;
      font-size: 0.85rem;
      text-align: center;
    }
    .spinner-sm {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: #ffffff;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class AuthModalComponent {
  authService = inject(AuthService);
  langService = inject(LanguageService);

  isSignUp = signal<boolean>(false);
  email = '';
  password = '';
  fullName = '';
  
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  setMode(signup: boolean) {
    this.isSignUp.set(signup);
    this.errorMessage.set(null);
  }

  onSubmit() {
    if (!this.email || !this.password) {
      this.errorMessage.set('Please fill out all required fields.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    if (this.isSignUp()) {
      this.authService.signup({ email: this.email, password: this.password, full_name: this.fullName }).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.resetForm();
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set(err.error?.detail || 'Failed to create account.');
        }
      });
    } else {
      this.authService.login({ email: this.email, password: this.password }).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.resetForm();
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set(err.error?.detail || 'Invalid email or password.');
        }
      });
    }
  }

  private resetForm() {
    this.email = '';
    this.password = '';
    this.fullName = '';
    this.errorMessage.set(null);
  }
}
