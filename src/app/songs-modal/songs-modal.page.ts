import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButtons, IonButton, IonIcon } from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular/standalone';
import { close, play } from 'ionicons/icons';

@Component({
  selector: 'app-songs-modal',
  templateUrl: './songs-modal.page.html',
  styleUrls: ['./songs-modal.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonButtons, IonButton, IonIcon, CommonModule, FormsModule]
})
export class SongsModalPage implements OnInit {

  @Input() songs: any[] = [];
  closeIcon = close;
  playIcon = play;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    console.log('SongsModal initialized with songs:', this.songs);
  }

  close(){
    this.modalCtrl.dismiss();
  }

  play(song: any){
    console.log('play song', song);
    // TODO: integrate playback service
  }

}
