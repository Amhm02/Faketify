import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MusicApiService {
  private baseUrl = 'https://music.fly.dev';

  constructor(private http: HttpClient) { }

  // Obtener todos los artistas
  getArtists(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/artists`);
  }

  // Obtener un artista por ID
  getArtistById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/artists/${id}`);
  }

  // Buscar artistas
  searchArtists(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/artists?q=${query}`);
  }

  // Obtener canciones de un artista específico
  getTracksByArtist(artistId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/tracks/artist/${artistId}`);
  }

  // Obtener todas las canciones
  getTracks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/tracks`);
  }

  // Obtener una canción por ID
  getTrackById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/tracks/${id}`);
  }

  // Obtener canciones de un álbum específico
  getTracksByAlbum(albumId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/tracks/album/${albumId}`);
  }
}
