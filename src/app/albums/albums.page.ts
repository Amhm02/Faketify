import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton } from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular/standalone';
import { ThemeService } from '../services/theme.service';
import { Music } from '../services/music';
import { ThemeButtonComponent } from '../components/theme-button/theme-button.component';

@Component({
  selector: 'app-albums',
  templateUrl: './albums.page.html',
  styleUrls: ['./albums.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, CommonModule, FormsModule, ThemeButtonComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AlbumsPage implements OnInit {

  albums: any;

  constructor(
    private themeService: ThemeService,
    private Music: Music,
    private modalCtrl: ModalController
  ) { }

  async ngOnInit() {
    await this.themeService.init();
    this.loadAlbums();
  }

  loadAlbums(){
    this.Music.getAlbums().then(albums => {
      this.albums = albums;
      console.log('albums', this.albums);
    });
  }

  async showSongs(albumId: string){
    console.log('album id: ', albumId);
    const songs = await this.Music.getSongsByAlbum(albumId);
    console.log('songs: ', songs);
    const modal = await this.modalCtrl.create({
      component: (await import('../songs-modal/songs-modal.page')).SongsModalPage,
      componentProps: { songs }
    });
    modal.present();
  }

}
