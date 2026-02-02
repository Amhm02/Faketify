import { Component, ChangeDetectorRef } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { register } from 'swiper/element/bundle';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, RouteConfigLoadStart, RouteConfigLoadEnd, ActivationStart, ActivationEnd, Event } from '@angular/router';
import { ThemeService } from './services/theme.service';

register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [
    IonApp,
    IonRouterOutlet
  ],
})
export class AppComponent {
  lastRouterEvent: string | null = null;
  lastError: string | null = null;

  constructor(private router: Router, private themeService: ThemeService, private cdr: ChangeDetectorRef) {
    this.themeService.init();

    // ensure the theme is applied across all pages and updates on change
    this.themeService.theme$.subscribe(theme => {
      try { this.themeService.applyTheme(theme); } catch(e) { /* ignore */ }
    });

    // router event logging + UI debug field
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
      // ensure UI updates
      try { this.cdr.detectChanges(); } catch (e) { /* ignore */ }
    });

    // also capture global errors into a UI-visible field
    window.addEventListener('error', (evt) => {
      this.lastError = evt.error ? (evt.error.message || String(evt.error)) : (evt.message || 'Unknown error');
      console.error('window.error captured:', evt.error || evt.message, evt);
      try { this.cdr.detectChanges(); } catch (e) { /* ignore */ }
    });

    window.addEventListener('unhandledrejection', (evt) => {
      this.lastError = evt.reason ? (evt.reason.message || String(evt.reason)) : String(evt.reason || evt);
      console.error('unhandledrejection captured:', evt.reason || evt, evt);
      try { this.cdr.detectChanges(); } catch (e) { /* ignore */ }
    });
  }
}
