import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, IonMenuButton } from '@ionic/angular/standalone';
import { ThemeService } from '../services/theme.service';
import { StorageService } from '../storage.service';
import { Router } from '@angular/router';
import { ThemeButtonComponent } from '../components/theme-button/theme-button.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, IonMenuButton, ThemeButtonComponent],
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
  ];

  constructor(
    private themeService: ThemeService,
    private storageService: StorageService,
    private router: Router
  ) { }

  async ngOnInit() {
    await this.themeService.init();
  }

  async goBack() {
    await this.storageService.remove('intro_seen');
    this.router.navigateByUrl("/intro");
  }
}
