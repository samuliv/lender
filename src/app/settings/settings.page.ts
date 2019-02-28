import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss']
})
export class SettingsPage {

  constructor (private router: Router, private alertController: AlertController) {
  }

  viewAboutLender () {
    this.router.navigate(['/about']);
  }

  myLendableItems() {
    this.router.navigate(['/my-lendable-items']);
  }

  async deleteAccount() {
    const alert = await this.alertController.create({
      header: 'Delete Account',
      subHeader: '',
      message: 'Are you sure you want to delete all your data and your account permanently?',
      buttons: [
        {
          text: 'Delete Account',
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
            console.log('TODO: LOGOUT');
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
