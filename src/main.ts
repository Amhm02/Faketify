import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { PreloadAllModules, RouteReuseStrategy, provideRouter, withPreloading } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

import { IonicStorageModule } from '@ionic/storage-angular';
import { addIcons } from 'ionicons';
import * as allIcons from 'ionicons/icons'

addIcons(allIcons);

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(),
    importProvidersFrom(IonicStorageModule.forRoot())
  ],
});

// Global error handlers to catch silent runtime failures (imports, unhandled rejections)
window.addEventListener('error', (evt) => {
  console.error('window.error captured:', evt.error || evt.message, evt);
});

window.addEventListener('unhandledrejection', (evt) => {
  console.error('unhandledrejection captured:', evt.reason || evt, evt);
});