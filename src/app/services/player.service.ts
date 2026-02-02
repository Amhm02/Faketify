import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private songSubject = new BehaviorSubject<any>(null);
  song$ = this.songSubject.asObservable();

  private audio = new Audio();

  constructor() {}

  setSong(song: any) {
    this.audio.pause();
    this.audio.src = song.preview_url;
    this.audio.load();

    this.songSubject.next({ ...song, playing: false });
  }

  play(song?: any) {
    if (song) {
      this.audio.src = song.preview_url;
      this.audio.load();
      this.audio.play();

      this.songSubject.next({ ...song, playing: true });
    } else {
      this.audio.play();

      const current = this.songSubject.value;
      if (current) {
        this.songSubject.next({ ...current, playing: true });
      }
    }
  }

  pause() {
    this.audio.pause();

    const current = this.songSubject.value;
    if (current) {
      this.songSubject.next({ ...current, playing: false });
    }
  }

  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;

    const current = this.songSubject.value;
    if (current) {
      this.songSubject.next({ ...current, playing: false });
    }
  }
}
