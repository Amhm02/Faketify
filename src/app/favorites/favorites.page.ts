import { Component, OnInit, OnDestroy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonSpinner,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonIcon,
    IonSearchbar,
    IonRefresher,
    IonRefresherContent
} from '@ionic/angular/standalone';
import { FavoritesService } from '../services/favorites.service';
import { PlayerService } from '../services/player.service';
import { MusicApiService } from '../services/music-api.service';
import { addIcons } from 'ionicons';
import { heart, heartOutline, play, musicalNotes, trashOutline, searchOutline, refresh } from 'ionicons/icons';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-favorites',
    templateUrl: './favorites.page.html',
    styleUrls: ['./favorites.page.scss'],
    standalone: true,
    imports: [
        IonContent,
        IonHeader,
        IonTitle,
        IonToolbar,
        IonButtons,
        IonMenuButton,
        IonSpinner,
        IonList,
        IonItem,
        IonLabel,
        IonButton,
        IonIcon,
        IonSearchbar,
        IonRefresher,
        IonRefresherContent,
        CommonModule,
        FormsModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FavoritesPage implements OnInit, OnDestroy {
    favoriteSongs: any[] = [];
    filteredSongs: any[] = [];
    loading: boolean = true;
    error: string = '';
    searchQuery: string = '';

    // Iconos
    heartIcon = heart;
    heartOutlineIcon = heartOutline;
    playIcon = play;
    musicalNotesIcon = musicalNotes;
    trashIcon = trashOutline;
    searchIcon = searchOutline;
    refreshIcon = refresh;

    private favoritesSubscription?: Subscription;

    constructor(
        private favoritesService: FavoritesService,
        private player: PlayerService,
        private musicApi: MusicApiService
    ) {
        addIcons({
            heart,
            'heart-outline': heartOutline,
            play,
            'musical-notes': musicalNotes,
            'trash-outline': trashOutline,
            'search-outline': searchOutline,
            refresh
        });
    }

    async ngOnInit() {
        this.loadFavorites();

        // Suscribirse a cambios en favoritos para mantener la lista actualizada
        this.favoritesSubscription = this.favoritesService.favorites$.subscribe(() => {
            // Se puede implementar lógica de actualización inteligente aquí si es necesario
        });
    }

    ngOnDestroy() {
        if (this.favoritesSubscription) {
            this.favoritesSubscription.unsubscribe();
        }
    }

    async loadFavorites(event?: any) {
        if (!event) this.loading = true;
        this.error = '';

        try {
            // 1. Obtener canciones generales
            this.musicApi.getTracks().subscribe({
                next: async (allTracks) => {
                    try {
                        // 2. Obtener favoritos
                        const observable = await this.favoritesService.getFavorites();
                        observable.subscribe({
                            next: (favData) => {
                                // 3. Mapeo seguro: usar Number() para comparar IDs
                                const mappedFavorites = favData.map(fav => {
                                    const trackId = fav.track_id || fav.id;
                                    const trackInfo = allTracks.find(t => Number(t.id) === Number(trackId));
                                    return trackInfo ? { ...trackInfo } : null;
                                }).filter(f => f !== null && f.preview_url);

                                this.favoriteSongs = mappedFavorites;
                                this.applyFilter();
                                this.loading = false;
                                if (event) event.target.complete();
                            },
                            error: (err) => {
                                console.error('Error al cargar favoritos:', err);
                                this.error = 'No se pudieron cargar tus favoritos.';
                                this.loading = false;
                                if (event) event.target.complete();
                            }
                        });
                    } catch (e) {
                        this.loading = false;
                        if (event) event.target.complete();
                    }
                },
                error: (err) => {
                    this.error = 'Error de conexión con la biblioteca.';
                    this.loading = false;
                    if (event) event.target.complete();
                }
            });
        } catch (err) {
            this.loading = false;
            if (event) event.target.complete();
        }
    }

    handleSearch(event: any) {
        this.searchQuery = event.target.value.toLowerCase();
        this.applyFilter();
    }

    applyFilter() {
        if (!this.searchQuery.trim()) {
            this.filteredSongs = [...this.favoriteSongs];
        } else {
            this.filteredSongs = this.favoriteSongs.filter(song => {
                const title = (song.name || song.title || '').toLowerCase();
                const artist = (song.artist || '').toLowerCase();
                return title.includes(this.searchQuery) || artist.includes(this.searchQuery);
            });
        }
    }

    playSong(song: any) {
        // Pasar la lista de favoritos como contexto de reproducción
        this.player.setSong(song, this.filteredSongs);
    }

    async removeFavorite(song: any, event: Event) {
        event.stopPropagation();

        try {
            const observable = await this.favoritesService.removeFromFavorites(song.id || song.track_id);
            observable.subscribe({
                next: () => {
                    // Eliminar de la lista local para feedback inmediato
                    this.favoriteSongs = this.favoriteSongs.filter(s => (s.id || s.track_id) !== (song.id || song.track_id));
                    this.applyFilter();
                },
                error: (err) => {
                    console.error('Error al eliminar favorito:', err);
                }
            });
        } catch (err) {
            console.error('Error en removeFavorite:', err);
        }
    }

    formatDuration(seconds: number): string {
        if (!seconds || isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}
