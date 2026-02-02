import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonApp,
  IonRouterOutlet,
  IonFooter,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
  IonProgressBar,
  IonIcon
} from '@ionic/angular/standalone';
import { register } from 'swiper/element/bundle';
import { PlayerService } from './services/player.service';
import {
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
  RouteConfigLoadStart,
  RouteConfigLoadEnd,
  ActivationStart,
  ActivationEnd,
  Event
} from '@angular/router';
import { ThemeService } from './services/theme.service';
import { addIcons } from 'ionicons';
import { heartOutline, play, pause } from 'ionicons/icons';

register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [
    IonApp,
    IonRouterOutlet,
    IonFooter,
    IonGrid,
    IonRow,
    IonCol,
    IonProgressBar,
    IonIcon,
    IonText,
    CommonModule
  ],
})
export class AppComponent {
  lastRouterEvent: string | null = null;
  lastError: string | null = null;

  currentSong: any = null;
  showDebugBanner = false;

  constructor(
    private router: Router,
    private themeService: ThemeService,
    private cdr: ChangeDetectorRef,
    private player: PlayerService
  ) {
    // Registrar íconos
    addIcons({
      'heart-outline': heartOutline,
      'play': play,
      'pause': pause,
    });

    this.themeService.init();

    this.themeService.theme$.subscribe(theme => {
      try { this.themeService.applyTheme(theme); } catch(e) {}
    });

    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.lastRouterEvent = `NavigationStart -> ${event.url}`;
      } else if (event instanceof RouteConfigLoadStart) {
        this.lastRouterEvent = `RouteConfigLoadStart -> ${String(event)}`;
      } else if (event instanceof RouteConfigLoadEnd) {
        this.lastRouterEvent = `RouteConfigLoadEnd -> ${String(event)}`;
      } else if (event instanceof ActivationStart) {
        this.lastRouterEvent = `ActivationStart -> ${event.snapshot?.routeConfig?.path}`;
      } else if (event instanceof ActivationEnd) {
        this.lastRouterEvent = `ActivationEnd -> ${event.snapshot?.routeConfig?.path}`;
      } else if (event instanceof NavigationEnd) {
        this.lastRouterEvent = `NavigationEnd -> ${event.url}`;
      } else if (event instanceof NavigationCancel) {
        this.lastRouterEvent = `NavigationCancel -> ${String(event)}`;
      } else if (event instanceof NavigationError) {
        this.lastRouterEvent = `NavigationError -> ${event.error}`;
        this.lastError = `NavigationError: ${String(event.error)}`;
      }

      try { this.cdr.detectChanges(); } catch (e) {}
    });

    this.player.song$.subscribe((song: any) => {
      console.log('AppComponent: player.song$ emitted ->', song);
      this.currentSong = song;
      try { this.cdr.detectChanges(); } catch(e) {}
    });

    window.addEventListener('error', (evt) => {
      this.lastError = evt.error ? (evt.error.message || String(evt.error)) : (evt.message || 'Unknown error');
      console.error('window.error captured:', evt.error || evt.message, evt);
      try { this.cdr.detectChanges(); } catch (e) {}
    });

    window.addEventListener('unhandledrejection', (evt) => {
      this.lastError = evt.reason ? (evt.reason.message || String(evt.reason)) : String(evt.reason || evt);
      console.error('unhandledrejection captured:', evt.reason || evt, evt);
      try { this.cdr.detectChanges(); } catch (e) {}
    });
  }

  play() {
    if (!this.currentSong) return;
    this.player.play(this.currentSong);
  }

  pause() {
    this.player.pause();
  }
}
