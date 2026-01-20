// 1. Importamos OnInit para ejecutar código al iniciar la página
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonButton, IonIcon,
  ActionSheetController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { colorPalette, sunny, moon, heart, star, close } from 'ionicons/icons';

// 2. Importamos NUESTRO servicio de almacenamiento (ajusta la ruta si es necesario)
import { StorageService } from '../storage.service';

// Clave para guardar el tema
const THEME_KEY = 'selected-theme';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButtons, IonButton, IonIcon
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
// 3. Implementamos OnInit
export class HomePage implements OnInit {

  genres = [
    {
      title: "Nu-Metal",
      image: "assets/slipknot.jpg",
      description: "Slipknot es una banda estadounidense...",
    },
    // ... resto de tus datos
    { title: "Metal industrial", image: "assets/Rammstein.png", description: "..." },
    { title: 'Metal gótico', image: 'assets/lord.jpg', description: '...' }
  ];

  constructor(
    private actionSheetCtrl: ActionSheetController,
    // 4. Inyectamos el StorageService
    private storageService: StorageService
  ) {
    addIcons({ colorPalette, sunny, moon, heart, star, close });
  }

  // 5. Al iniciar, cargamos el tema guardado
  async ngOnInit() {
    const savedTheme = await this.storageService.get(THEME_KEY);
    if (savedTheme) {
      console.log('Tema cargado del storage:', savedTheme);
      // Aplicamos el tema sin volver a guardarlo (false)
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

  // 6. Función actualizada para guardar en storage
  changeTheme(theme: string, saveToStorage: boolean = true) {
    // Limpiar clases previas
    document.body.classList.remove('theme-dark', 'theme-rosa', 'theme-amarillo');

    // Aplicar nueva clase si no es light
    if (theme !== 'light') {
      document.body.classList.add(`theme-${theme}`);
    }

    // Guardar si es necesario
    if (saveToStorage) {
      console.log('Guardando nuevo tema:', theme);
      this.storageService.set(THEME_KEY, theme);
    }
  }
}