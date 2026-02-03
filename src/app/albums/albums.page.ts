import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonIcon, IonSearchbar, IonSpinner, IonCard, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { MusicApiService } from '../services/music-api.service';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { library, search, albums } from 'ionicons/icons';

@Component({
  selector: 'app-albums',
  templateUrl: './albums.page.html',
  styleUrls: ['./albums.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonIcon,
    IonSearchbar,
    IonSpinner,
    IonCard,
    IonGrid,
    IonRow,
    IonCol,
    CommonModule,
    FormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AlbumsPage implements OnInit {
  albums: any[] = [];
  filteredAlbums: any[] = [];
  loading: boolean = true;
  error: string = '';
  searchQuery: string = '';

  constructor(
    private musicApi: MusicApiService,
    private router: Router
  ) {
    addIcons({ library, search, albums });
  }

  ngOnInit() {
    this.loadAlbums();
  }

  loadAlbums() {
    this.loading = true;
    this.musicApi.getArtists().subscribe({ // Usamos artists o si hay un endpoint de albums directo mejor
      next: () => {
        // Como la API no tiene un endpoint /albums directo (según MusicApiService), 
        // pero el servicio Music sí lo tiene, vamos a usar el catálogo de canciones 
        // para agrupar o simplemente usar el endpoint de Music service si existe.
        // Pero para ser consistente con MusicApiService:
        this.musicApi.getTracks().subscribe({
          next: (tracks) => {
            // Agrupar tracks por album_id para simular una lista de álbumes si no hay endpoint directo
            const albumMap = new Map();
            tracks.forEach(track => {
              if (track.album_id && !albumMap.has(track.album_id)) {
                albumMap.set(track.album_id, {
                  id: track.album_id,
                  name: `Álbum #${track.album_id}`,
                  artist: track.artist || 'Varios Artistas',
                  image: track.image || track.cover_url || null
                });
              }
            });
            this.albums = Array.from(albumMap.values());
            this.filteredAlbums = [...this.albums];
            this.loading = false;
          },
          error: () => {
            this.error = 'Error al cargar álbumes';
            this.loading = false;
          }
        });
      }
    });
  }

  handleSearch(event: any) {
    const query = event.target.value.toLowerCase();
    this.searchQuery = query;
    this.filteredAlbums = this.albums.filter(a =>
      a.name.toLowerCase().includes(query) ||
      a.artist.toLowerCase().includes(query)
    );
  }

  goToAlbum(album: any) {
    this.router.navigate(['/menu/music'], {
      queryParams: {
        albumId: album.id,
        albumName: album.name
      }
    });
  }
}
