import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private audio = new Audio();

  // Estado de la canción actual
  private songSubject = new BehaviorSubject<any>(null);
  song$ = this.songSubject.asObservable();

  // Estado del tiempo y duración
  private currentTimeSubject = new BehaviorSubject<number>(0);
  currentTime$ = this.currentTimeSubject.asObservable();

  private durationSubject = new BehaviorSubject<number>(0);
  duration$ = this.durationSubject.asObservable();

  // Gestión de cola para Siguiente/Anterior
  private playlist: any[] = [];
  private currentIndex: number = -1;

  constructor() {
    this.setupAudioListeners();
  }

  private setupAudioListeners() {
    // Actualización de tiempo constante
    this.audio.addEventListener('timeupdate', () => {
      this.currentTimeSubject.next(this.audio.currentTime);
    });

    // Captura de duración cuando el archivo carga
    this.audio.addEventListener('durationchange', () => {
      if (this.audio.duration && !isNaN(this.audio.duration)) {
        this.durationSubject.next(this.audio.duration);
      }
    });

    // Manejo de finalización: Intenta reproducir la siguiente si hay cola
    this.audio.addEventListener('ended', () => {
      console.log('--- Audio Finalizado ---');
      if (this.currentIndex < this.playlist.length - 1) {
        this.next();
      } else {
        this.updatePlayingState(false);
      }
    });

    // Sincronización de estado cuando el hardware empieza el play
    this.audio.addEventListener('play', () => {
      console.log('--- Audio en Reproducción ---');
      this.updatePlayingState(true);
    });

    // Sincronización de estado cuando el hardware pausa
    this.audio.addEventListener('pause', () => {
      console.log('--- Audio en Pausa ---');
      this.updatePlayingState(false);
    });

    this.audio.addEventListener('error', (e) => {
      console.error('CRITICAL: Audio Error Event:', e);
      this.updatePlayingState(false);
    });
  }

  private updatePlayingState(playing: boolean) {
    const current = this.songSubject.value;
    if (current && current.playing !== playing) {
      this.songSubject.next({ ...current, playing });
    }
  }

  // MÉTODO CLAVE: Aislamiento total de la canción
  setSong(song: any, list: any[] = []) {
    if (!song || !song.preview_url) {
      console.error('Intento de cargar canción inválida:', song);
      return;
    }

    // Aislamiento de datos: clonamos para que cambios en la UI no afecten al player
    const targetSong = JSON.parse(JSON.stringify(song));

    // Si pasamos una lista, la guardamos como contexto de reproducción
    if (list && list.length > 0) {
      this.playlist = list;
      this.currentIndex = list.findIndex(s => s.id === targetSong.id);
    } else if (this.playlist.length === 0) {
      // Si no hay lista previa, creamos una con esta canción
      this.playlist = [targetSong];
      this.currentIndex = 0;
    }

    console.log(`[Player] Cargando canción: ${targetSong.name || targetSong.title} (ID: ${targetSong.id})`);

    // SI es la misma ID, solo hacemos play/pause
    const current = this.songSubject.value;
    if (current && current.id === targetSong.id) {
      this.play();
      return;
    }

    // LIMPIEZA ATÓMICA: Evita que el audio anterior "sangre" al nuevo
    this.audio.pause();
    this.audio.src = ''; // Vacía el buffer
    this.audio.load();

    // Nueva carga
    this.audio.src = targetSong.preview_url;
    this.audio.load();

    // Update state
    this.songSubject.next({ ...targetSong, playing: false });

    // Play automático
    this.play();
  }

  play() {
    if (!this.audio.src) return;

    this.audio.play().catch(err => {
      console.error('Error de reproducción:', err);
    });
  }

  pause() {
    this.audio.pause();
  }

  next() {
    if (this.playlist.length > 0 && this.currentIndex < this.playlist.length - 1) {
      this.currentIndex++;
      this.setSong(this.playlist[this.currentIndex], this.playlist);
    }
  }

  previous() {
    if (this.playlist.length > 0 && this.currentIndex > 0) {
      this.currentIndex--;
      this.setSong(this.playlist[this.currentIndex], this.playlist);
    }
  }

  seek(seconds: number) {
    if (this.audio.duration && !isNaN(this.audio.duration)) {
      this.audio.currentTime = seconds;
    }
  }

  getPlaylist() {
    return this.playlist;
  }
}
