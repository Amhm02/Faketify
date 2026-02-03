import { Component, OnInit, OnDestroy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { StorageService } from '../storage.service';
import { ThemeService } from '../services/theme.service';
import { ThemeButtonComponent } from '../components/theme-button/theme-button.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, ThemeButtonComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class IntroPage implements OnInit, OnDestroy {

  slides = [
    {
      title: 'Bienvenido a Faketify',
      image: 'assets/spoti logo.jpg',
      description: 'Tu plataforma de música favorita. Descubre millones de canciones y artistas de todo el mundo.'
    },
    {
      title: 'Millones de Canciones',
      image: 'assets/generos-musicales.webp',
      description: 'Explora miles de géneros musicales. Desde rock hasta electrónica, encuentra tu sonido perfecto.'
    },
    {
      title: 'Tus Artistas Favoritos',
      image: 'assets/billboard.webp',
      description: 'Lleva a tus artistas favoritos siempre contigo. Crea playlists personalizadas y disfruta sin límites.'
    },
    {
      title: '¡Comienza Ahora!',
      image: 'assets/SPOTIFY.webp',
      description: 'Empieza a disfrutar de la mejor experiencia musical. Tu música, tu estilo, tu momento.'
    }
  ];

  currentSlide: number = 0;
  slideTheme: string = 'light';
  private themeSub?: Subscription;

  constructor(
    private router: Router,
    private storageService: StorageService,
    private themeService: ThemeService
  ) { }

  async ngOnInit() {
    await this.themeService.init();
    this.themeSub = this.themeService.theme$.subscribe(theme => {
      this.slideTheme = theme;
    });
  }

  ngOnDestroy() {
    if (this.themeSub) {
      this.themeSub.unsubscribe();
    }
  }

  get isLastSlide(): boolean {
    return this.currentSlide === this.slides.length - 1;
  }

  get currentSlideData() {
    return this.slides[this.currentSlide];
  }

  nextSlide() {
    if (this.currentSlide < this.slides.length - 1) {
      this.currentSlide++;
    }
  }

  previousSlide() {
    if (this.currentSlide > 0) {
      this.currentSlide--;
    }
  }

  async startApp() {
    await this.storageService.set('intro_seen', true);
    const isLoggedIn = await this.storageService.get('login');
    if (isLoggedIn) {
      this.router.navigateByUrl('/menu/home');
    } else {
      this.router.navigateByUrl('/login');
    }
  }

  async resetIntroSeen() {
    await this.storageService.remove('intro_seen');
    this.currentSlide = 0;
  }
}
