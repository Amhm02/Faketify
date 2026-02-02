import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton
} from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular/standalone';
import { ThemeService } from '../services/theme.service';
import { Music } from '../services/music';
import { PlayerService } from '../services/player.service';
import { ThemeButtonComponent } from '../components/theme-button/theme-button.component';

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
    CommonModule,
    FormsModule,
    ThemeButtonComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AlbumsPage implements OnInit {

  albums: any[] = [];

  constructor(
    private themeService: ThemeService,
    private Music: Music,
    private modalCtrl: ModalController,
    private player: PlayerService
  ) {}

  async ngOnInit() {
    await this.themeService.init();
    this.loadAlbums();
  }

  loadAlbums() {
  this.Music.getAlbums$().subscribe(albums => {
    this.albums = albums;
    console.log('albums completos:', this.albums);
  });
}

  async showSongs(album: any) {
    console.log('album seleccionado: ', album);

    this.Music.getSongsByAlbum$(album.id).subscribe(async songs => {
      console.log('songs: ', songs);

      const modal = await this.modalCtrl.create({
        component: (await import('../songs-modal/songs-modal.page')).SongsModalPage,
        componentProps: { songs }
      });

      await modal.present();

      const { data } = await modal.onDidDismiss();
      console.log('modal.onDidDismiss returned:', data);

      if (data) {
        console.log('Selected song from modal:', data);

        const songWithArtist = {
          ...data,
          artist: album.artist || album.artist_name || album.artistName || `Artista #${data.artist_id}`
        };

        this.player.setSong(songWithArtist);
        console.log('Published selected song to PlayerService:', songWithArtist);
      }
    });
  }
}
