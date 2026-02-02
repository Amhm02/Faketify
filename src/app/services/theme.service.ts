import { Injectable } from '@angular/core';
import { StorageService } from '../storage.service';
import { BehaviorSubject } from 'rxjs';

export const THEME_KEY = 'selected-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private current = new BehaviorSubject<string>('light');
  theme$ = this.current.asObservable();

  constructor(private storage: StorageService) {}

  async init() {
    const saved = await this.storage.get(THEME_KEY);
    if (saved) {
      this.current.next(saved);
      this.applyTheme(saved);
    } else {
      this.current.next('light');
      this.applyTheme('light');
    }
  }

  getTheme(): string {
    return this.current.value;
  }

  async setTheme(theme: string) {
    this.current.next(theme);
    await this.storage.set(THEME_KEY, theme);
    this.applyTheme(theme);
  }

  async getThemeFromStorage(): Promise<string | null> {
    return await this.storage.get(THEME_KEY);
  }

  applyTheme(theme: string) {
    document.body.classList.remove('theme-dark', 'theme-rosa', 'theme-amarillo', 'theme-light');
    if (theme === 'light') {
      document.body.classList.add('theme-light');
    } else {
      document.body.classList.add(`theme-${theme}`);
    }
  }
}

