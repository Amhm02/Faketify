import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton,
  ModalController
} from '@ionic/angular/standalone';
import { ThemeService } from '../services/theme.service';
import { StorageService } from '../storage.service';
import { Router } from '@angular/router';
import { ThemeButtonComponent } from '../components/theme-button/theme-button.component';
import { Music } from '../services/music';
import { SongsModalPage } from '../songs-modal/songs-modal.page';
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

  genres = [
    {
      title: "Nu-Metal",
      image: "assets/slipknot.jpg",
      description: "Slipknot es una banda estadounidense de heavy metal y nu metal formada en 1995 en Des Moines, Iowa. Sus integrantes en la actualidad son Corey Taylor, Jim Root, Mick Thomson, Shawn Crahan, Sid Wilson, Alessandro Venturella, Michael Pfaff y Eloy Casagrande.",
    },
    {
      title: "Metal industrial",
      image: "assets/Rammstein.png",
      description: "Rammstein es una banda alemana de metal industrial fundada en 1994 por los músicos Till Lindemann, Richard Z. Kruspe, Oliver Riedel, Paul Landers, Christian Lorenz y Christoph Schneider.​"
    },
    {
      title: 'Metal gótico',
      image: 'assets/lord.jpg',
      description: 'Lord of the Lost es una banda alemana de metal gótico procedente de Hamburgo y creada en 2007 como un proyecto en solitario en manos del músico Chris "The Lord" Harms.'
    },
    {
      title: 'Chelo metal',
      image: 'assets/apocalyptica.webp',
      description: 'Apocalyptica es una banda de metal alternativo y chelo metal formada en Helsinki en 1992.'
    }
  ];

  tracks: any[] = [];
  albums: any[] = [];
  song: any = null;

  constructor(
    private themeService: ThemeService,
    private storageService: StorageService,
    private router: Router,
    private Music: Music,
    private modalCtrl: ModalController,
    private player: PlayerService
  ) {
    this.player.song$.subscribe(song => {
      this.song = song;
    });
  }

  async ngOnInit() {
    await this.themeService.init();
    this.loadTracks();
  }

  async goBack() {
    this.loadTracks();
    await this.storageService.remove('intro_seen');
    this.router.navigateByUrl('/intro');
  }

  loadTracks() {
    this.Music.getTracks$().subscribe(tracks => {
      this.tracks = tracks;
      console.log('Las canciones:', this.tracks);
    });
  }

  async showSongs(albumId: string) {
    console.log('album id:', albumId);

    this.Music.getSongsByAlbum$(albumId).subscribe(async songs => {
      console.log('songs:', songs);

      const modal = await this.modalCtrl.create({
        component: SongsModalPage,
        componentProps: { songs }
      });

      await modal.present();

      const { data } = await modal.onDidDismiss();
      if (data) {
        this.player.setSong(data);
      }
    });
  }

  play() {
    this.player.play();
  }

  pause() {
    this.player.pause();
  }

  formatTime(seconds: number){
    if (!seconds || isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}
