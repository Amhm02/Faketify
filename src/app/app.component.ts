import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonApp,
  IonRouterOutlet,
  IonFooter,
  IonIcon,
  IonButton,
  IonRange
} from '@ionic/angular/standalone';
import { register } from 'swiper/element/bundle';
import { PlayerService } from './services/player.service';
import { Router } from '@angular/router';
import { ThemeService } from './services/theme.service';
import { addIcons } from 'ionicons';
import {
  heartOutline,
  heart,
  play,
  pause,
  playSkipBack,
  playSkipForward,
  repeat,
  shuffle
} from 'ionicons/icons';

register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    IonApp,
    IonRouterOutlet,
    IonFooter,
    IonIcon,
    IonButton,
    IonRange,
    CommonModule
  ],
})
export class AppComponent implements OnInit {
  currentSong: any = null;
  currentTime: number = 0;
  duration: number = 0;
  progress: number = 0;

  constructor(
    private router: Router,
    private themeService: ThemeService,
    private cdr: ChangeDetectorRef,
    public player: PlayerService
  ) {
    // Registrar íconos
    addIcons({
      'heart-outline': heartOutline,
      'heart': heart,
      'play': play,
      'pause': pause,
      'play-skip-back': playSkipBack,
      'play-skip-forward': playSkipForward,
      'repeat': repeat,
      'shuffle': shuffle
    });
  }

  async ngOnInit() {
    await this.themeService.init();

    this.themeService.theme$.subscribe(theme => {
      try { this.themeService.applyTheme(theme); } catch (e) { }
    });

    this.player.song$.subscribe((song: any) => {
      this.currentSong = song;
      this.cdr.detectChanges();
    });

    this.player.currentTime$.subscribe(time => {
      this.currentTime = time;
      this.calculateProgress();
      this.cdr.detectChanges();
    });

    this.player.duration$.subscribe(duration => {
      this.duration = duration;
      this.calculateProgress();
      this.cdr.detectChanges();
    });
  }

  private calculateProgress() {
    if (this.duration > 0) {
      this.progress = this.currentTime / this.duration;
    } else {
      this.progress = 0;
    }
  }

  onSeek(event: any) {
    const value = event.detail.value;
    this.player.seek(value);
  }

  play() {
    if (!this.currentSong) return;
    this.player.play();
  }

  pause() {
    this.player.pause();
  }

  formatTime(seconds: number): string {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}
