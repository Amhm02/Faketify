import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonMenu, IonRouterOutlet, IonList, IonItem, IonIcon, IonLabel, IonMenuToggle, NavController, MenuController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, logOutOutline, informationCircleOutline, personCircleOutline, closeCircleOutline } from 'ionicons/icons';
import { StorageService } from '../storage.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonMenu,
    IonRouterOutlet,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
    IonMenuToggle,
    CommonModule,
    FormsModule,
    RouterModule
  ]
})
export class MenuPage implements OnInit {

  constructor(
    private storage: StorageService,
    private navCtrl: NavController,
    private menu: MenuController,
    private router: Router
  ) {
    addIcons({ homeOutline, logOutOutline, informationCircleOutline, personCircleOutline, closeCircleOutline });
  }

  ngOnInit() {
  }

  // Prevent double navigation: navigation lock and single code path
  private navigating: boolean = false;

  async navigate(path: string) {
    if (this.navigating) {
      console.warn('Navigation blocked: already navigating to', path);
      return;
    }
    this.navigating = true;

    try {
      console.log('navigate(): closing menu and navigating to', path);
      await this.menu.close();

      // Small delay to ensure menu closed state processed
      await new Promise(res => setTimeout(res, 50));

      // Dynamic import check (optional)
      try {
        const mod = await import('../artists/artists.page');
        console.log('Dynamic import artists page succeeded:', mod);
      } catch (impErr) {
        console.warn('Dynamic import failed (non-fatal):', impErr);
      }

      // Navigate via Router and await result
      try {
        const result = await this.router.navigateByUrl(path);
        console.log('router.navigateByUrl result:', result);
      } catch (rerr) {
        console.error('router.navigateByUrl error:', rerr);
      }

    } catch (err) {
      console.error('Error en navigate():', err);
    } finally {
      // keep navigating locked a tiny bit to avoid double clicks
      setTimeout(() => { this.navigating = false; }, 350);
    }
  }

  async logout() {
    await this.storage.remove('login');
    this.navCtrl.navigateRoot('/login');
  }

}
