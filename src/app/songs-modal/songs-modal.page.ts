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
  IonIcon
} from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular/standalone';
import { close, play } from 'ionicons/icons';
import { PlayerService } from '../services/player.service';

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
    CommonModule,
    FormsModule
  ]
})
export class SongsModalPage implements OnInit {

  @Input() songs: any[] = [];
  closeIcon = close;
  playIcon = play;

  constructor(
    private modalCtrl: ModalController,
    private player: PlayerService
  ) {}

  ngOnInit() {}

  close() {
    this.modalCtrl.dismiss();
  }

  async play(song: any) {
    this.player.setSong(song);
    await this.modalCtrl.dismiss(song);
  }

  async selectSong(song: any) {
    this.player.setSong(song);
    await this.modalCtrl.dismiss(song);
  }
}
