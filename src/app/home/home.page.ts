import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonMenuButton, ModalController } from '@ionic/angular/standalone';
import { ThemeService } from '../services/theme.service';
import { StorageService } from '../storage.service';
import { Router } from '@angular/router';
import { ThemeButtonComponent } from '../components/theme-button/theme-button.component';
import { Music } from '../services/music'
import { albums, albumsSharp } from 'ionicons/icons';
import { SongsModalPage } from '../songs-modal/songs-modal.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonMenuButton, ThemeButtonComponent],
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
      description: 'Lord of the Lost es una banda alemana de metal gótico procedente de Hamburgo y creada en 2007 como un proyecto en solitario en manos del músico Chris "The Lord" Harms, quien anteriormente había sido cantante y guitarrista del grupo de rock Philiae y también guitarrista y segundo vocalista del grupo de glam metal The Pleasures.'
    },
    {
      title: 'Chelo metal',
      image: 'assets/apocalyptica.webp',
      description: 'Apocalyptica es una banda de metal alternativo y chelo metal formada en Helsinki en 1992 por cuatro violonchelistas graduados de la academia de música clásica Sibelius.​ Es conocida por tocar canciones de hard rock/heavy metal con violonchelos.'
    }
  ]

  tracks: any;
  albums: any;
  localArtists: any;

  constructor(
    private themeService: ThemeService,
    private storageService: StorageService,
    private router: Router,
    private Music: Music,
    private modalCtrl: ModalController
  ) { }

  async ngOnInit() {
    this.getLocalArtists();
    await this.themeService.init();
    this.loadTracks();
  }

  async goBack() {
    this.loadTracks();
    await this.storageService.remove('intro_seen');
    this.router.navigateByUrl("/intro");
  }

  loadTracks(){
    this.Music.getTracks().then(tracks =>{
      this.tracks = tracks;
      console.log(this.tracks, "las canciones")
    })
  }

  getLocalArtists(){
    this.localArtists = this.Music.getLocalArtists();
    console.log(this.localArtists);
  }

  async showSongs(albumId: string){
    console.log("album id: ", albumId)
    const songs = await this.Music.getSongsByAlbum(albumId);
    console.log("songs: ", songs)
    const modal = await this.modalCtrl.create({
      component: SongsModalPage,
      componentProps: {
        songs: songs}
  });
  modal.present();
  }

}
