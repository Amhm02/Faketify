import { Injectable } from '@angular/core';
import * as dataArtists from './artistas.json';
import { Observable, from, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Track { id: string; title: string; artist?: string; preview_url?: string; [key: string]: any; }
export interface Album { id: string; name: string; tracks?: Track[]; [key: string]: any; }
export interface Artist { id: string; name: string; image?: string; [key: string]: any; }

@Injectable({ providedIn: 'root' })
export class Music {
  urlServer = "https://music.fly.dev";

  constructor() { }

  getTracks$() {
    return from(fetch(`${this.urlServer}/tracks`).then(res => res.json()));
  }

  getAlbums$() {
    return from(fetch(`${this.urlServer}/albums`).then(res => res.json()));
  }

  getSongsByAlbum$(albumId: string) {
    return from(fetch(`${this.urlServer}/tracks/album/${albumId}`).then(res => res.json()));
  }

  getLocalArtists() {
    return (dataArtists as any).default || dataArtists;
  }
}
