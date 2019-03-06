import { Component, OnInit } from '@angular/core';
import { ActionSheetController, Events, IonApp } from '@ionic/angular';
import { ExtraService } from '../../services/extra/extra.service';
import { Router } from '@angular/router';
import { GpsPositionService } from 'src/app/services/gps-position/gps-position.service';
import { MediaItem } from 'src/app/interfaces/mediaitem';
import { WbmaService } from 'src/app/services/wbma/wbma.service';
import { GpsDistanceService } from 'src/app/services/gps-distance/gps-distance.service';

@Component({
  selector: 'app-browse',
  templateUrl: 'browse.page.html',
  styleUrls: ['browse.page.scss']
})

export class BrowsePage implements OnInit{

  useGpsLocation: boolean;
  setDateRange: boolean;
  maxDistance: number;
  maxPrice: number;
  currentLocationName: string;

  startTime: string;
  endTime: string;

  selectedCategoryID = 0;
  selectedCategoryName = 'All';
  selectedCategoryContains: number[] = [];

  browseItemsCount: string;
  refreshTimer: any;
  browseItems = false;

  borrowableItems: MediaItem[] = [];
  tempItems: MediaItem[] = [];

  constructor(
    public actionSheetController: ActionSheetController,
    public extra: ExtraService,
    private router: Router,
    private gpsPositionService: GpsPositionService,
    private gpsDistance: GpsDistanceService,
    private wbma: WbmaService,
    private events: Events) {
      this.maxDistance = 20;
      this.useGpsLocation = true;
      this.maxPrice = 0;
      this.setDateRange = false;
      this.currentLocationName = '(none)';


      const currentTime = new Date();
      currentTime.setTime(currentTime.getTime() + (1 * 60 * 60 * 1000));
      this.startTime = currentTime.toISOString();
      currentTime.setTime(currentTime.getTime() + (1 * 60 * 60 * 1000));
      this.endTime  = currentTime.toISOString();

      this.events.subscribe('location-changed', () => {
        this.refreshLocationData();
      });

      this.events.subscribe('category-clicked', (id, categroyname, contains) => {
        this.selectedCategoryID = id;
        this.selectedCategoryName = categroyname;
        this.selectedCategoryContains = contains;
        this.someParameterChanged();
      });
  }

  ngOnInit() {
    this.refreshLocationData();
  }

  browseItemsButtonClick() {
    this.browseItems = true;
  }

  closeBrowse() {
    this.browseItems = false;
  }

  refreshLocationData() {
    if (!this.gpsPositionService.getIsLocationByGPS()) {
      this.useGpsLocation = false;
    }
    this.currentLocationName = this.gpsPositionService.getCurrentLocationName();
    this.someParameterChanged();
  }

  browseCategory() {
    this.router.navigate(['/browse-category/browse']);
  }

  chooseLocationManually() {
    this.router.navigate(['/choose-location/browse']);
  }

  gpsLocationClick() {
    if (this.useGpsLocation) {
      this.gpsPositionService.tryToFetchCurrentGPSCoordinates();
    }
    this.someParameterChanged();
  }

  someParameterChanged() {
    clearTimeout(this.refreshTimer);
    this.refreshTimer = setTimeout( () => { this.refreshBrowseItemsCount(); }, 250);
  }

  applyFiltering(arr: MediaItem[]) {
    if (arr.length > 0) {
      for (let i = arr.length - 1; i > -1; i--) {
        let hideItem = false;
        const distance = this.gpsDistance.calculateDistance(
          this.gpsPositionService.latitude,
          this.gpsPositionService.longitude,
          arr[i].media_data.lat,
          arr[i].media_data.lon);
        if (this.selectedCategoryID !== 0) {
          if(this.selectedCategoryContains.indexOf(arr[i].media_data.category) === -1) {
            hideItem = true;
          }
        }
        if (hideItem === false && this.maxPrice !== 201 && this.maxPrice < arr[i].media_data.price) {
          hideItem = true;
        }
        if (hideItem === false && this.maxDistance !== 201 && distance > this.maxDistance) {
          hideItem = true;
        }
        if ( hideItem ) {
          arr.splice(i, 1);
        } else {
          arr[i].distance = this.gpsDistance.formatDistance(distance);
        }
      }
    }
  }

  refreshBrowseItemsCount() {
    this.borrowableItems = [];
    this.wbma.getAllMediaByAppTagAsMediaItem().subscribe((res) => {
      this.tempItems = this.wbma.readMediaData(res);
      this.applyFiltering(this.tempItems);
      this.borrowableItems = this.tempItems;
    });
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
    console.log('browse.page.ts : ionViewDidEnter()');
  }

}
