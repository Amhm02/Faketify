import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { StorageService } from '../storage.service';
import { ThemeService } from '../services/theme.service';
import { ThemeButtonComponent } from '../components/theme-button/theme-button.component';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
  standalone: true,
  imports: [ CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, ThemeButtonComponent ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class IntroPage implements OnInit {

  slides = [
    { title: 'Bienvenido', image: 'assets/spoti logo.jpg'},
    { title: 'Millones de canciones', image: 'assets/generos-musicales.webp', description: 'Miles de géneros.' },
    { title: 'Millones de artistas', image: 'assets/billboard.webp', description: 'Lleva tu a artista favorito siempre contigo.' },
    { title: 'Disfruta', image: 'assets/SPOTIFY.webp', description: 'Empieza a streamer dando click a Home' }
  ];

  slideTheme: 'light'|'dark'|'rosa'|'amarillo' = 'light';

  constructor(private router: Router, private storageService: StorageService, private themeService: ThemeService) {
  }

  async ngOnInit() {
    await this.themeService.init();
    const saved = this.themeService.getTheme();
    const allowed = ['light','dark','rosa','amarillo'];
    if (saved && allowed.includes(saved)) {
      this.slideTheme = saved as 'light'|'dark'|'rosa'|'amarillo';
    } else {
      this.slideTheme = 'light';
    }
  }

  async changeTheme(theme: string, saveToStorage: boolean = true) {
    this.slideTheme = theme as any;

    if (saveToStorage) {
      await this.themeService.setTheme(theme);
    } else {
      this.themeService.applyTheme(theme);
    }
  }

  async startApp() {
    await this.storageService.set('intro_seen', true);
    const isLoogedIn = await this.storageService.get ('login');
    if (isLoogedIn){
      this.router.navigateByUrl('/home');
    } else {
      this.router.navigateByUrl('/login');
    }
  }

  async resetIntroSeen() {
    await this.storageService.remove('intro_seen');
  }
}