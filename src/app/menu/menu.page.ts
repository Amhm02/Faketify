import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonRouterOutlet, IonMenu, IonSplitPane, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem } from '@ionic/angular/standalone';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonRouterOutlet, IonMenu, IonSplitPane, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem]
})
export class MenuPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
