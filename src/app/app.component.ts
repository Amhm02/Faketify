import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { register } from 'swiper/element/bundle';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, RouteConfigLoadStart, RouteConfigLoadEnd, ActivationStart, ActivationEnd, Event } from '@angular/router';

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
  constructor(private router: Router) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        console.log('Router: NavigationStart', event.url);
      } else if (event instanceof RouteConfigLoadStart) {
        console.log('Router: RouteConfigLoadStart', event);
      } else if (event instanceof RouteConfigLoadEnd) {
        console.log('Router: RouteConfigLoadEnd', event);
      } else if (event instanceof ActivationStart) {
        console.log('Router: ActivationStart', event.snapshot?.routeConfig?.path);
      } else if (event instanceof ActivationEnd) {
        console.log('Router: ActivationEnd', event.snapshot?.routeConfig?.path);
      } else if (event instanceof NavigationEnd) {
        console.log('Router: NavigationEnd', event.url);
      } else if (event instanceof NavigationCancel) {
        console.warn('Router: NavigationCancel', event);
      } else if (event instanceof NavigationError) {
        console.error('Router: NavigationError', event.error);
      } else {
        // other router events
        // console.log('Router event', event);
      }
    });
  }
}
