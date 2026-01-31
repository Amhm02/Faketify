import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { PreloadAllModules, RouteReuseStrategy, provideRouter, withPreloading } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

import { IonicStorageModule } from '@ionic/storage-angular';
import { addIcons } from 'ionicons';
import * as allIcons from 'ionicons/icons'

addIcons(allIcons);

bootstrapApplication (AppComponent, {
  providers: [
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    provideIonicAngular(),
    provideRouter (routes, withPreloading(PreloadAllModules)),
    Storage
  ],
}
)

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes),
    importProvidersFrom(IonicStorageModule.forRoot())
  ],
});