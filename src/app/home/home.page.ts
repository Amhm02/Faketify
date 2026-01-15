import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class HomePage {
  genres = [
    {
      title: "Nu-Metal",
      image: "assets/slipknot.jpg",
      description: "Lorem Ipsum es un texto de relleno en latín sin sentido que se usa en diseño gráfico y maquetación para previsualizar la apariencia de una página o diseño sin distraer con contenido real.",

    }
  ]
  constructor() {}
}
