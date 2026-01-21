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
    { title: 'Bienvenido', image: 'assets/slipknot.jpg', description: 'Descubre nuestra demo de temas con slides dinámicos.' },
    { title: 'Explora Temas', image: 'assets/Rammstein.png', description: 'Cambia el color del slide con un botón.' },
    { title: 'Personaliza', image: 'assets/lord.jpg', description: 'Guarda tu tema preferido y llévalo contigo.' },
    { title: 'Disfruta', image: 'assets/slipknot.jpg', description: 'Navega al Home cuando estés listo.' }
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
    this.router.navigateByUrl('/home');
  }

  async resetIntroSeen() {
    await this.storageService.remove('intro_seen');
  }
}