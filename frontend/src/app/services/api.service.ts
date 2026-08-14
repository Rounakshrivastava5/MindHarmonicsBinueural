import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Genre } from '../models/genre.model';
import { BinauralPreset } from '../models/binaural-preset.model';
import { Voice } from '../models/voice.model';
import { Track, TrackCreate, TrackListResponse } from '../models/track.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private baseUrl = 'http://127.0.0.1:8000/api/v1';

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    const authHeaders = this.authService.getAuthHeaders();
    if (authHeaders['Authorization']) {
      headers = headers.set('Authorization', authHeaders['Authorization']);
    }
    return headers;
  }

  getGenres(): Observable<Genre[]> {
    return this.http.get<Genre[]>(`${this.baseUrl}/genres`);
  }

  getBinauralPresets(): Observable<BinauralPreset[]> {
    return this.http.get<BinauralPreset[]>(`${this.baseUrl}/binaural-presets`);
  }

  getVoices(): Observable<Voice[]> {
    return this.http.get<Voice[]>(`${this.baseUrl}/voices`);
  }

  generateTrack(payload: TrackCreate): Observable<Track> {
    return this.http.post<Track>(`${this.baseUrl}/tracks/generate`, payload, { headers: this.getHeaders() });
  }

  getTracks(genreId?: number, favoriteOnly: boolean = false): Observable<TrackListResponse> {
    let params = new HttpParams();
    if (genreId) {
      params = params.set('genre_id', genreId.toString());
    }
    if (favoriteOnly) {
      params = params.set('favorite_only', 'true');
    }
    return this.http.get<TrackListResponse>(`${this.baseUrl}/tracks`, { params, headers: this.getHeaders() });
  }

  getTrackStreamUrl(trackId: string): string {
    return `${this.baseUrl}/tracks/${trackId}/stream`;
  }

  toggleFavorite(trackId: string): Observable<Track> {
    return this.http.post<Track>(`${this.baseUrl}/tracks/${trackId}/favorite`, {}, { headers: this.getHeaders() });
  }

  deleteTrack(trackId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/tracks/${trackId}`, { headers: this.getHeaders() });
  }
}
