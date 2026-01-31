import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { StorageService } from '../storage.service';

export const introGuard: CanActivateFn = async () => {
  const storage = inject(StorageService);
  const router = inject(Router);
  const seen = await storage.get('intro_seen');
  console.log('introGuard: intro_seen =', seen);
  if (!seen) {
    router.navigateByUrl('/intro');
    return false;
  }
  return true;
};

export const authGuard: CanActivateFn = async () => {
  const storage = inject(StorageService);
  const router = inject(Router);
  const isLogged = await storage.get('login');
  console.log('authGuard: login =', isLogged);
  if (isLogged) {
    return true;
  } else {
    router.navigateByUrl('/login');
    return false;
  }
};
