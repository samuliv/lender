import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ActionSheetController } from '@ionic/angular';
import { WbmaService } from 'src/app/services/wbma/wbma.service';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss']
})
export class SettingsPage implements OnInit{

  devToolsHiddenMenuStep1 = false;
  devToolsImageClick = 0;
  devToolsButtonClick = 0;
  showDevTools = false;

  constructor (
    private router: Router,
    private alertController: AlertController,
    private wbma: WbmaService,
    private glb: GlobalService,
    private actionSheetController: ActionSheetController
    ) {
  }

  ngOnInit() {
    if (localStorage.getItem('lender-dev-tools') === 'c898124xv82y3813jasd9x81247891bc1') {
      this.showDevTools = true;
    }
  }

  devToolsHiddenClick(num: number) {
    if (num === 0) {
      this.devToolsImageClick++;
      if (this.devToolsImageClick === 5) {
        this.devToolsHiddenMenuStep1 = !this.devToolsHiddenMenuStep1;
        this.devToolsButtonClick = 0;
        this.devToolsImageClick=0;
        if (this.showDevTools) {
          this.showDevTools = false;
          localStorage.removeItem('lender-dev-tools');
        }
      }
    } else {
      this.devToolsButtonClick++;
      if (this.devToolsButtonClick === 5){ 
        this.showDevTools = true;
        localStorage.setItem('lender-dev-tools', 'c898124xv82y3813jasd9x81247891bc1');
      }
    }
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
            this.glb.messagePrompt('Sorry', 'Metropolia´s WBMA-api only provides user deletion for ADMINS =(');
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
          text: 'Logout',
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

  async devTools() {
    const actionSheet = await this.actionSheetController.create({
      header: 'DevTools Hidden Menu',
      buttons: [{
        text: 'Clear Welcome Tour',
        handler: () => {
          this.devToolsClearWelcomeTour();
        }
      }, {
        text: 'Clear Whole Storage',
        role: 'desctuctive',
        handler: () => {
          this.devToolsClearStorage();
        }
      } , {
        text: 'Cancel',
        role: 'cancel'
      }]
    });
    await actionSheet.present();
  }

  devToolsClearWelcomeTour() {
    localStorage.removeItem('lendertour');
    this.glb.messagePrompt('Clear Welcome Tour', 'Cleared - close and open app again.');
  }

  devToolsClearStorage() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

}
