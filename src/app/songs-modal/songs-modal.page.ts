import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonButtons,
  IonButton,
  IonIcon,
  IonSpinner
} from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular/standalone';
import { close, play, heart, heartOutline, musicalNotes } from 'ionicons/icons';
import { PlayerService } from '../services/player.service';
import { FavoritesService } from '../services/favorites.service';

@Component({
  selector: 'app-songs-modal',
  templateUrl: './songs-modal.page.html',
  styleUrls: ['./songs-modal.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonList,
    IonItem,
    IonLabel,
    IonButtons,
    IonButton,
    IonIcon,
    IonSpinner,
    CommonModule,
    FormsModule
  ]
})
export class SongsModalPage implements OnInit {

  @Input() songs: any[] = [];
  closeIcon = close;
  playIcon = play;
  heartIcon = heart;
  heartOutlineIcon = heartOutline;
  musicalNotesIcon = musicalNotes;

  // Mapa para rastrear el estado de favoritos de cada canción
  favoritesMap: Map<number, boolean> = new Map();
  loadingFavorites: Set<number> = new Set();

  constructor(
    private modalCtrl: ModalController,
    private player: PlayerService,
    private favoritesService: FavoritesService
  ) { }

  async ngOnInit() {
    // Cargar estado de favoritos para todas las canciones
    await this.loadFavoritesStatus();

    // Suscribirse a cambios en favoritos
    this.favoritesService.favorites$.subscribe(() => {
      this.loadFavoritesStatus();
    });
  }

  async loadFavoritesStatus() {
    for (const song of this.songs) {
      const isFav = await this.favoritesService.isFavorite(song.id);
      this.favoritesMap.set(song.id, isFav);
    }
  }

  isFavorite(songId: number): boolean {
    return this.favoritesMap.get(songId) || false;
  }

  isLoadingFavorite(songId: number): boolean {
    return this.loadingFavorites.has(songId);
  }

  async toggleFavorite(song: any, event: Event) {
    event.stopPropagation(); // Evitar que se reproduzca la canción al hacer clic en favorito

    this.loadingFavorites.add(song.id);

    try {
      const observable = await this.favoritesService.toggleFavorite(song.id);

      observable.subscribe({
        next: (response) => {
          console.log('Favorito actualizado:', response);
          // El estado se actualiza automáticamente a través del BehaviorSubject
          this.loadingFavorites.delete(song.id);
        },
        error: (error) => {
          console.error('Error al actualizar favorito:', error);
          this.loadingFavorites.delete(song.id);

          // Revertir el cambio visual si hubo error
          const currentState = this.favoritesMap.get(song.id);
          this.favoritesMap.set(song.id, !currentState);
        }
      });
    } catch (error) {
      console.error('Error al toggle favorito:', error);
      this.loadingFavorites.delete(song.id);
    }
  }

  close() {
    this.modalCtrl.dismiss();
  }

  async play(song: any) {
    this.player.setSong(song, this.songs);
    await this.modalCtrl.dismiss(song);
  }

  async selectSong(song: any) {
    this.player.setSong(song, this.songs);
    await this.modalCtrl.dismiss(song);
  }

  formatDuration(seconds: number): string {
    if (!seconds || isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}
