import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonMenu, IonRouterOutlet, IonList, IonItem, IonIcon, IonLabel, IonMenuToggle, NavController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, logOutOutline, informationCircleOutline } from 'ionicons/icons';
import { StorageService } from '../storage.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonMenu,
    IonRouterOutlet,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
    IonMenuToggle,
    CommonModule,
    FormsModule,
    RouterModule
  ]
})
export class MenuPage implements OnInit {

  constructor(
    private storage: StorageService,
    private navCtrl: NavController
  ) {
    addIcons({ homeOutline, logOutOutline, informationCircleOutline });
  }

  ngOnInit() {
  }

  async logout() {
    await this.storage.remove('login');
    this.navCtrl.navigateRoot('/login');
  }

}
