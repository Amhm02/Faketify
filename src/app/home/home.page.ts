import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, ActionSheetController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { colorPalette, sunny, moon, heart, star, close } from 'ionicons/icons';
import { StorageService } from '../storage.service';
import { Router } from '@angular/router';

const THEME_KEY = 'selected-theme';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon],
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
    }
  ];

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private storageService: StorageService,
    private router: Router
  ) {
    addIcons({ colorPalette, sunny, moon, heart, star, close });
  }

  async ngOnInit() {
    const savedTheme = await this.storageService.get(THEME_KEY);
    if (savedTheme) {
      console.log('Tema cargado del storage:', savedTheme);
      this.changeTheme(savedTheme, false);
    }
  }

  async presentThemeActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Selecciona un Tema',
      buttons: [
        { text: 'Claro (Original)', icon: 'sunny', handler: () => { this.changeTheme('light'); } },
        { text: 'Oscuro', icon: 'moon', handler: () => { this.changeTheme('dark'); } },
        { text: 'Rosa Pastel', icon: 'heart', handler: () => { this.changeTheme('rosa'); } },
        { text: 'Amarillo', icon: 'star', handler: () => { this.changeTheme('amarillo'); } },
        { text: 'Cancelar', icon: 'close', role: 'cancel' }
      ]
    });
    await actionSheet.present();
  }
  
  changeTheme(theme: string, saveToStorage: boolean = true) {
    document.body.classList.remove('theme-dark', 'theme-rosa', 'theme-amarillo');

    if (theme !== 'light') {
      document.body.classList.add(`theme-${theme}`);
    }

    if (saveToStorage) {
      console.log('Guardando nuevo tema:', theme);
      this.storageService.set(THEME_KEY, theme);
    }
  }


  goBack() {
    console.log("Navegando a Intro...");

    this.router.navigateByUrl("/intro");
  }
}