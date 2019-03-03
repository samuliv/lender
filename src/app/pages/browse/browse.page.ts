import { Component } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { ExtraService } from '../../services/extra/extra.service';
import { Router } from '@angular/router';

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
  currentLocationName: string;

  startTime: string;
  endTime: string;

  browseItemsCount: string;
  refreshTimer: any;

  constructor(public actionSheetController: ActionSheetController, public extra: ExtraService, private router: Router) {
    this.maxDistance = 20;
    this.useGpsLocation = true;
    this.maxPrice = 0;
    this.setDateRange = false;
    this.currentLocationName = '-';

    const currentTime = new Date();
    currentTime.setTime(currentTime.getTime() + (1 * 60 * 60 * 1000));
    this.startTime = currentTime.toISOString();
    currentTime.setTime(currentTime.getTime() + (1 * 60 * 60 * 1000));
    this.endTime  = currentTime.toISOString();
  }

  browseCategory() {
    this.router.navigate(['/browse-category/browse']);
  }

  chooseLocationManually() {
    this.router.navigate(['/choose-location/browse']);
  }

  someParameterChanged() {
    clearTimeout(this.refreshTimer);
    this.refreshTimer = setTimeout( () => { this.refreshBrowseItemsCount(); }, 250);
  }

  refreshBrowseItemsCount() {
    console.log('***REFRESH BROWSE ITEM COUNT***');
    // TODO
    this.browseItemsCount = Math.floor(Math.random() * 100).toString();
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
