import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StorageService } from '../storage.service';

@Injectable({ providedIn: 'root' })
export class IntroGuard implements CanActivate {
  constructor(private storage: StorageService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    const seen = await this.storage.get('intro_seen');
    if (!seen) {
      await this.router.navigateByUrl('/intro');
      return false;
    }

    return true;
  }
}

export class AuthGuard implements CanActivate {
  constructor(
    private storage: StorageService,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean> {
    const isLogged = await this.storage.get('login');

    if (isLogged) {
      return true; 
    } else {
      await this.router.navigateByUrl('/login');
      return false;
    }
  }
}
