import { Component } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { ExtraService } from '../extra.service';

@Component({
  selector: 'app-browse',
  templateUrl: 'browse.page.html',
  styleUrls: ['browse.page.scss']
})

export class BrowsePage {

  useGpsLocation: boolean;
  setDateRange: boolean;
  maxDistance: number;
  maxPrice: number;

  constructor(public actionSheetController: ActionSheetController, public extra: ExtraService) {
    this.maxDistance = 20;
    this.useGpsLocation = true;
    this.maxPrice = 0;
    this.setDateRange = false;
  }

  chooseLocationManually() {
    console.log('**CLICK**');
  }

  async quickSearch() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Quick Search',
      buttons: [{
        text: 'Cars',
        handler: () => {
          console.log('Share clicked');
        }
      }, {
        text: 'Power Tools',
        handler: () => {
          console.log('Play clicked');
        }
      }, {
        text: 'Musical Instruments',
        handler: () => {
          console.log('Favorite clicked');
        }
      }, {
        text: 'Accommodation',
        handler: () => {
          console.log('Favorite clicked');
        }
      }, {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  ionViewDidEnter() {
    this.extra.getMessages(1);
    console.log('browse.page.ts : ionViewDidEnter()');
  }

}
