import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Genre } from '../models/genre.model';
import { BinauralPreset } from '../models/binaural-preset.model';
import { Voice } from '../models/voice.model';
import { Track, TrackCreate, TrackListResponse } from '../models/track.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  
  // Public Cloudflare Tunnel Backend URL
  private baseUrl = environment.apiUrl || 'https://statistics-hampton-eco-correctly.trycloudflare.com/api/v1';

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
    return this.http.post<Track>(`${this.baseUrl}/tracks/generate`, payload);
  }

  getTracks(genreId?: number, favoriteOnly: boolean = false): Observable<TrackListResponse> {
    let params = new HttpParams();
    if (genreId) {
      params = params.set('genre_id', genreId.toString());
    }
    if (favoriteOnly) {
      params = params.set('favorite_only', 'true');
    }
    return this.http.get<TrackListResponse>(`${this.baseUrl}/tracks`, { params });
  }

  getTrackStreamUrl(trackId: string): string {
    return `${this.baseUrl}/tracks/${trackId}/stream`;
  }

  toggleFavorite(trackId: string): Observable<Track> {
    return this.http.post<Track>(`${this.baseUrl}/tracks/${trackId}/favorite`, {});
  }

  deleteTrack(trackId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/tracks/${trackId}`);
  }
}
