import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonList,
    IonItem,
    IonLabel,
    IonSpinner,
    IonSearchbar,
    IonBackButton
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { play, heart, heartOutline, musicalNotes } from 'ionicons/icons';
import { PlayerService } from '../services/player.service';
import { FavoritesService } from '../services/favorites.service';
import { MusicApiService } from '../services/music-api.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-music',
    templateUrl: './music.page.html',
    styleUrls: ['./music.page.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        IonContent,
        IonHeader,
        IonTitle,
        IonToolbar,
        IonButtons,
        IonButton,
        IonIcon,
        IonList,
        IonItem,
        IonLabel,
        IonSpinner,
        IonSearchbar,
        IonBackButton
    ]
})
export class MusicPage implements OnInit, OnDestroy {
    playIcon = play;
    heartIcon = heart;
    heartOutlineIcon = heartOutline;
    musicalNotesIcon = musicalNotes;

    songs: any[] = [];
    filteredSongs: any[] = [];
    artistId: number | null = null;
    artistName: string = '';
    albumId: number | null = null;
    albumName: string = '';
    searchQuery: string = '';

    loading: boolean = true;
    error: string = '';

    favoritesMap: Map<number, boolean> = new Map();
    loadingFavorites: Set<number> = new Set();

    private favoritesSubscription?: Subscription;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private player: PlayerService,
        private favoritesService: FavoritesService,
        private musicApiService: MusicApiService
    ) { }

    ngOnInit() {
        // Obtener parámetros de la ruta
        this.route.queryParams.subscribe(params => {
            this.artistId = params['artistId'] ? parseInt(params['artistId']) : null;
            this.artistName = params['artistName'] || '';

            this.albumId = params['albumId'] ? parseInt(params['albumId']) : null;
            this.albumName = params['albumName'] || '';

            if (this.artistId) {
                this.loadSongsByArtist(this.artistId);
            } else if (this.albumId) {
                this.loadSongsByAlbum(this.albumId);
            } else {
                this.loadAllSongs();
            }
        });

        // Suscribirse a cambios en favoritos
        this.favoritesSubscription = this.favoritesService.favorites$.subscribe(() => {
            this.loadFavoritesStatus();
        });
    }

    loadSongsByAlbum(albumId: number) {
        this.loading = true;
        this.error = '';

        this.musicApiService.getTracksByAlbum(albumId).subscribe({
            next: (songs) => {
                this.songs = songs;
                this.filteredSongs = songs;
                this.loading = false;
                this.loadFavoritesStatus();
            },
            error: (error) => {
                console.error('Error al cargar canciones del álbum:', error);
                this.error = 'No se pudieron cargar las canciones del álbum';
                this.loading = false;
            }
        });
    }

    ngOnDestroy() {
        if (this.favoritesSubscription) {
            this.favoritesSubscription.unsubscribe();
        }
    }

    loadSongsByArtist(artistId: number) {
        this.loading = true;
        this.error = '';

        this.musicApiService.getTracksByArtist(artistId).subscribe({
            next: (songs) => {
                this.songs = songs;
                this.filteredSongs = songs;
                this.loading = false;
                this.loadFavoritesStatus();
            },
            error: (error) => {
                console.error('Error al cargar canciones:', error);
                this.error = 'No se pudieron cargar las canciones';
                this.loading = false;
            }
        });
    }

    loadAllSongs() {
        this.loading = true;
        this.error = '';

        this.musicApiService.getTracks().subscribe({
            next: (songs) => {
                this.songs = songs;
                this.filteredSongs = songs;
                this.loading = false;
                this.loadFavoritesStatus();
            },
            error: (error) => {
                console.error('Error al cargar canciones:', error);
                this.error = 'No se pudieron cargar las canciones';
                this.loading = false;
            }
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
        event.stopPropagation();

        this.loadingFavorites.add(song.id);

        try {
            const observable = await this.favoritesService.toggleFavorite(song.id);

            observable.subscribe({
                next: (response) => {
                    console.log('Favorito actualizado:', response);
                    this.loadingFavorites.delete(song.id);
                },
                error: (error) => {
                    console.error('Error al actualizar favorito:', error);
                    this.loadingFavorites.delete(song.id);

                    const currentState = this.favoritesMap.get(song.id);
                    this.favoritesMap.set(song.id, !currentState);
                }
            });
        } catch (error) {
            console.error('Error al toggle favorito:', error);
            this.loadingFavorites.delete(song.id);
        }
    }

    playSong(song: any) {
        this.player.setSong(song, this.filteredSongs);
    }

    handleSearch(event: any) {
        const query = event.target.value.toLowerCase();
        this.searchQuery = query;

        if (!query.trim()) {
            this.filteredSongs = this.songs;
            return;
        }

        this.filteredSongs = this.songs.filter(song => {
            const title = (song.title || song.name || '').toLowerCase();
            const artist = (song.artist || '').toLowerCase();
            return title.includes(query) || artist.includes(query);
        });
    }

    formatDuration(seconds: number): string {
        if (!seconds || isNaN(seconds)) return '0:00';
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    goBack() {
        this.router.navigate(['/menu/home']);
    }
}
