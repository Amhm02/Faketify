import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
  IonSearchbar,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { MusicApiService } from '../services/music-api.service';
import { ThemeService } from '../services/theme.service';
import { ThemeButtonComponent } from '../components/theme-button/theme-button.component';
import { musicalNotes, person } from 'ionicons/icons';

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
    IonSpinner,
    IonSearchbar,
    IonButton,
    IonIcon,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    CommonModule,
    FormsModule,
    ThemeButtonComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ArtistsPage implements OnInit {
  artists: any[] = [];
  filteredArtists: any[] = [];
  loading: boolean = true;
  error: string = '';
  searchQuery: string = '';

  musicalNotesIcon = musicalNotes;
  personIcon = person;

  constructor(
    private musicApiService: MusicApiService,
    private themeService: ThemeService,
    private router: Router
  ) {
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
        this.filteredArtists = data;
        this.loading = false;
        console.log('Artistas cargados:', this.artists);
      },
      error: (err) => {
        this.error = 'Error al cargar artistas. Por favor intente más tarde.';
        this.loading = false;
        console.error('Error:', err);
      }
    });
  }

  handleSearch(event: any) {
    const query = event.target.value.toLowerCase();
    this.searchQuery = query;

    if (!query.trim()) {
      this.filteredArtists = this.artists;
      return;
    }

    this.filteredArtists = this.artists.filter(artist => {
      const name = (artist.name || '').toLowerCase();
      const bio = (artist.bio || '').toLowerCase();
      return name.includes(query) || bio.includes(query);
    });
  }

  viewArtistSongs(artist: any) {
    console.log('Navegando a canciones del artista:', artist);
    this.router.navigate(['/menu/music'], {
      queryParams: {
        artistId: artist.id,
        artistName: artist.name
      }
    });
  }

  getArtistImage(artist: any): string {
    return artist.image || 'assets/default-artist.jpg';
  }
}
