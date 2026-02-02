import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MusicApiService {
  private baseUrl = 'https://music.fly.dev';

  constructor(private http: HttpClient) { }

  getArtists(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/artists`);
  }

  getArtistById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/artists/${id}`);
  }

  searchArtists(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/artists?q=${query}`);
  }
}
