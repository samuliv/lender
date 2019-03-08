import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { WbmaService } from 'src/app/services/wbma/wbma.service';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss']
})
export class SettingsPage {

  constructor (private router: Router, private alertController: AlertController, private wbma: WbmaService) {
  }

  viewMyProfile () {
    this.router.navigate(['/my-profile']);
  }

  viewAboutLender () {
    this.router.navigate(['/about']);
  }

  viewMyLendableItems() {
    this.router.navigate(['/my-lendable-items/settings']);
  }

  async deleteAccount() {
    const alert = await this.alertController.create({
      header: 'Delete Account',
      subHeader: '',
      message: 'Are you sure you want to delete all your data and your account permanently?',
      buttons: [
        {
          text: 'Delete',
          handler: () => {
            console.log('TODO: DELETE ACCOUNT');
          }
        }, {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });

    await alert.present();
  }

  async logOut() {
    const alert = await this.alertController.create({
      header: 'Log Out',
      subHeader: '',
      message: 'Are you sure you want to log out?',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.wbma.logout();
            this.router.navigate(['/login']);
          }
        }, {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });

    await alert.present();
  }
}
