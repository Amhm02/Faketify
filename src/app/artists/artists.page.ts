import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonSpinner, IonText, IonSearchbar } from '@ionic/angular/standalone';
import { MusicApiService } from '../services/music-api.service';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-artists',
  templateUrl: './artists.page.html',
  styleUrls: ['./artists.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    CommonModule,
    FormsModule,
    IonSpinner,
    IonText,
    IonSearchbar
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ArtistsPage implements OnInit {
  artists: any[] = [];
  loading: boolean = true;
  error: string = '';
  searchQuery: string = '';

  constructor(private musicApiService: MusicApiService, private themeService: ThemeService) {
    console.log('ArtistsPage: constructor');
  }

  async ngOnInit() {
    console.log('ArtistsPage: ngOnInit');
    await this.themeService.init();
    this.loadArtists();
  }

  loadArtists() {
    this.loading = true;
    this.error = '';
    
    this.musicApiService.getArtists().subscribe({
      next: (data) => {
        this.artists = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar artistas. Por favor intente más tarde.';
        this.loading = false;
        console.error('Error:', err);
      }
    });
  }

  onSearchChange(event: any) {
    const query = event.detail.value;
    
    if (!query || query.trim() === '') {
      this.loadArtists();
      return;
    }

    this.loading = true;
    this.musicApiService.searchArtists(query).subscribe({
      next: (data) => {
        this.artists = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error en la búsqueda.';
        this.loading = false;
      }
    });
  }
}
