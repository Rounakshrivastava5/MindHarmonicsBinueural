import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User, UserSignUp, UserLogin, AuthTokenResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = 'http://127.0.0.1:8000/api/v1/auth';

  readonly currentUser = signal<User | null>(null);
  readonly token = signal<string | null>(null);
  readonly isLoggedIn = computed(() => !!this.currentUser() && !!this.token());
  readonly isAuthModalOpen = signal<boolean>(false);

  constructor() {
    this.loadStoredSession();
  }

  private loadStoredSession() {
    const storedToken = localStorage.getItem('mindharmonics_token');
    const storedUser = localStorage.getItem('mindharmonics_user');

    if (storedToken && storedUser) {
      try {
        this.token.set(storedToken);
        this.currentUser.set(JSON.parse(storedUser));
      } catch (e) {
        this.clearSession();
      }
    }
  }

  signup(payload: UserSignUp): Observable<AuthTokenResponse> {
    return this.http.post<AuthTokenResponse>(`${this.baseUrl}/signup`, payload).pipe(
      tap((res) => this.setSession(res))
    );
  }

  login(payload: UserLogin): Observable<AuthTokenResponse> {
    return this.http.post<AuthTokenResponse>(`${this.baseUrl}/login`, payload).pipe(
      tap((res) => this.setSession(res))
    );
  }

  logout() {
    this.clearSession();
  }

  openAuthModal() {
    this.isAuthModalOpen.set(true);
  }

  closeAuthModal() {
    this.isAuthModalOpen.set(false);
  }

  private setSession(res: AuthTokenResponse) {
    this.token.set(res.access_token);
    this.currentUser.set(res.user);
    localStorage.setItem('mindharmonics_token', res.access_token);
    localStorage.setItem('mindharmonics_user', JSON.stringify(res.user));
    this.closeAuthModal();
  }

  private clearSession() {
    this.token.set(null);
    this.currentUser.set(null);
    localStorage.removeItem('mindharmonics_token');
    localStorage.removeItem('mindharmonics_user');
  }

  getAuthHeaders(): { [key: string]: string } {
    const tok = this.token();
    return tok ? { Authorization: `Bearer ${tok}` } : {};
  }
}
