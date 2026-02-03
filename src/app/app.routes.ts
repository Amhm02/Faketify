import { Routes } from '@angular/router';
import { introGuard, authGuard } from './guards/intro.guard';

export const routes: Routes = [
  {
    path: 'menu',
    loadComponent: () => import('./menu/menu.page').then(m => m.MenuPage),
    canActivate: [authGuard, introGuard],
    children: [
      {
        path: 'home',
        loadComponent: () => import('./home/home.page').then(m => m.HomePage),
      },
      {
        path: 'artists',
        loadComponent: () => import('./artists/artists.page').then(m => m.ArtistsPage)
      },
      {
        path: 'albums',
        loadComponent: () => import('./albums/albums.page').then(m => m.AlbumsPage)
      },
      {
        path: 'music',
        loadComponent: () => import('./music/music.page').then(m => m.MusicPage)
      },
      {
        path: 'favorites',
        loadComponent: () => import('./favorites/favorites.page').then(m => m.FavoritesPage)
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'menu/home',
    pathMatch: 'full',
  },
  {
    path: 'intro',
    loadComponent: () => import('./intro/intro.page').then(m => m.IntroPage),
    canActivate: [authGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.page').then(m => m.RegisterPage)
  },
  {
    path: 'songs-modal',
    loadComponent: () => import('./songs-modal/songs-modal.page').then(m => m.SongsModalPage)
  }
];
