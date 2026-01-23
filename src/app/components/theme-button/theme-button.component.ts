import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { ActionSheetController } from '@ionic/angular';
import { ThemeService } from '../../services/theme.service';
import { addIcons } from 'ionicons';
import { colorPalette, sunny, moon, heart, star, close } from 'ionicons/icons';

@Component({
  selector: 'app-theme-button',
  standalone: true,
  imports: [CommonModule, IonButton, IonIcon],
  template: `
    <ion-button aria-label="Cambiar tema" (click)="presentThemeActionSheet()">
      <ion-icon slot="icon-only" name="color-palette"></ion-icon>
    </ion-button>
  `,
})
export class ThemeButtonComponent {
  constructor(private actionSheetCtrl: ActionSheetController, private themeService: ThemeService) {
    addIcons({ colorPalette, sunny, moon, heart, star, close });
  }

  async presentThemeActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Selecciona un Tema',
      buttons: [
        { text: 'Claro (Original)', icon: 'sunny', handler: () => { this.changeTheme('light'); } },
        { text: 'Oscuro', icon: 'moon', handler: () => { this.changeTheme('dark'); } },
        { text: 'Rosa Pastel', icon: 'heart', handler: () => { this.changeTheme('rosa'); } },
        { text: 'Amarillo', icon: 'star', handler: () => { this.changeTheme('amarillo'); } },
        { text: 'Cancelar', icon: 'close', role: 'cancel' }
      ]
    });

    await actionSheet.present();
  }

  private changeTheme(theme: string) {
    this.themeService.setTheme(theme);
  }
}
