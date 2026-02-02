import { inject } from '@angular/core';
import { Router, CanActivateFn, UrlTree } from '@angular/router';
import { StorageService } from '../storage.service';

export const introGuard: CanActivateFn = async (): Promise<boolean | UrlTree> => {
  const storage = inject(StorageService);
  const router = inject(Router);
  const seen = await storage.get('intro_seen');
  return seen || router.parseUrl('/intro');
};

export const authGuard: CanActivateFn = async (): Promise<boolean | UrlTree> => {
  const storage = inject(StorageService);
  const router = inject(Router);
  const isLogged = await storage.get('login');
  return isLogged || router.parseUrl('/login');
};
