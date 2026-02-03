import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton
} from '@ionic/angular/standalone';
import { ThemeService } from '../services/theme.service';
import { StorageService } from '../storage.service';
import { Router } from '@angular/router';
import { ThemeButtonComponent } from '../components/theme-button/theme-button.component';
import { Music } from '../services/music';
import { MusicApiService } from '../services/music-api.service';
import { PlayerService } from '../services/player.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonMenuButton,
    ThemeButtonComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomePage implements OnInit {

  // Artistas cargados desde el servidor
  artists: any[] = [];
  loadingArtists: boolean = true;
  errorLoadingArtists: string = '';

  tracks: any[] = [];
  albums: any[] = [];
  song: any = null;

  constructor(
    private themeService: ThemeService,
    private storageService: StorageService,
    private router: Router,
    private Music: Music,
    private musicApiService: MusicApiService,
    private player: PlayerService
  ) {
    this.player.song$.subscribe(song => {
      this.song = song;
    });
  }

  async ngOnInit() {
    await this.themeService.init();
    this.loadArtists();
    this.loadTracks();
  }

  async goBack() {
    this.loadTracks();
    await this.storageService.remove('intro_seen');
    this.router.navigateByUrl('/intro');
  }

  // Cargar artistas desde el servidor
  loadArtists() {
    this.loadingArtists = true;
    this.errorLoadingArtists = '';

    this.musicApiService.getArtists().subscribe({
      next: (artists) => {
        this.artists = artists;
        this.loadingArtists = false;
        console.log('Artistas cargados:', this.artists);
      },
      error: (error) => {
        console.error('Error al cargar artistas:', error);
        this.errorLoadingArtists = 'No se pudieron cargar los artistas';
        this.loadingArtists = false;
      }
    });
  }

  loadTracks() {
    this.Music.getTracks$().subscribe(tracks => {
      this.tracks = tracks;
      console.log('Las canciones:', this.tracks);
    });
  }

  // Función para mostrar canciones de un artista
  showSongsByArtist(artist: any) {
    console.log('Navegando a canciones del artista:', artist);

    // Navegar a la página de música con parámetros
    this.router.navigate(['/menu/music'], {
      queryParams: {
        artistId: artist.id,
        artistName: artist.name
      }
    });
  }

  showSongs(albumId: string) {
    console.log('Navegando a canciones del álbum:', albumId);

    // Navegar a la página de música
    // Nota: Podrías necesitar agregar soporte para álbumes en la página de música
    this.router.navigate(['/menu/music']);
  }

  play() {
    this.player.play();
  }

  pause() {
    this.player.pause();
  }

  formatTime(seconds: number) {
    if (!seconds || isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}
