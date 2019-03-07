import { Component, OnInit } from '@angular/core';
import { ActionSheetController, Events, IonApp } from '@ionic/angular';
import { ExtraService } from '../../services/extra/extra.service';
import { Router } from '@angular/router';
import { GpsPositionService } from 'src/app/services/gps-position/gps-position.service';
import { MediaItem } from 'src/app/interfaces/mediaitem';
import { WbmaService } from 'src/app/services/wbma/wbma.service';
import { GpsDistanceService } from 'src/app/services/gps-distance/gps-distance.service';
import { extractDirectiveDef } from '@angular/core/src/render3/definition';

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
  searchText: string;

  startTime: string;
  endTime: string;

  selectedCategoryID = 0;
  selectedCategoryName = 'All';
  selectedCategoryContains: number[] = [];

  browseItemsCount: string;
  refreshTimer: any;
  browseItems = false;
  moreSearchOptions = false;

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
      this.maxPrice = 5;
      this.setDateRange = false;
      this.searchText = '';
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

  moreSearchOptionsToggle() {
    this.moreSearchOptions = !this.moreSearchOptions;
    if (this.searchText !== '') {
      this.someParameterChanged();
    }
  }

  browseItemsButtonClick() {
    if (this.borrowableItems.length > 0) {
      this.browseItems = true;
    } else {
      console.log('No Items!');
    }
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

  requestLendNow() {
    console.log('TODO');
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
        if (hideItem === false && this.moreSearchOptions && this.searchText !== '') {
          // perform text serach
          const searchItems = this.searchText.split(' ');
          let somethingFound = false;
          for(let s = 0; s < searchItems.length; s++) {
            if ( arr[i].title.toLowerCase() !== arr[i].title.toLowerCase().replace(searchItems[s].toLowerCase(), '') ) {
              somethingFound = true;
            } else if ( arr[i].media_data.description.toLowerCase() 
                        !== arr[i].media_data.description.toLowerCase().replace(searchItems[s].toLowerCase(), '')
                        ) {
              somethingFound = true;
            }
          }
          if ( !somethingFound ) {
            hideItem = true;
          }
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

  quickSearchAction(args: string[]) {
    this.selectedCategoryID = parseInt(args[0], 10);
    this.selectedCategoryName = '';
    this.maxPrice = parseInt(args[1], 10);
    this.maxDistance = parseInt(args[2], 10);
    const neededAt = args[3];
    const neededFor = args[4];
    this.extra.getCategoryNameById(this.selectedCategoryID).subscribe((res) => {870
      if (res.success) {
        this.selectedCategoryName = res.response;
        // @ts-ignore
        this.selectedCategoryContains = res.contains;
      }
    })
  }

  quickSearch(step?: number, args?: string[]) {
    if (!step) {
      step = 0;
    }
    if (!args) {
      args = [];
    }
    const steps = `Please, select a category; Cars: 2; Power Tools: 28; Musical Instruments: 47; Accommodation: 34
                   How much it can cost per hour?; Nothing: 0; 1e/h: 1; 5e/h: 5; 10e/h: 10; 50e/h: 50; No limit: 201
                   How near it has to be located?; 2km : 2; 5km : 5; 20km : 20; No limit: 201
                   When do you need it?; Immediately: immediately; After 2 hours: 2h; Tomorrow morning: tmrrw-m; Tomorrow evening: tmrrw-e
                   How long do you need it?; for 1 hour: 1; for 2 hours: 2; for 8 hours: 8; whole day: 24; two days: 48`;

    const rows = steps.split('\n');
    if (step !== 5) {
      this.presentQuickSearchStep(step, rows[step], args);
    } else {
      this.quickSearchAction(args);
    }
  }

  async presentQuickSearchStep(step: number, data: string, args?: string[]) {
    const dataItems = data.split(';');
    const buttons: any = [];
    if (dataItems.length > 1) {
      for (let i=1; i < dataItems.length; i++) {
        const items = dataItems[i].split(':');
        buttons.push({
          text: items[0],
          handler: () => {
            args.push(items[1].trim());
            this.quickSearch(step+1, args);
          }
        })
      }
    }
    buttons.push({
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
        console.log('Quick Search Cancelled.');
      }
    });
    const actionSheet = await this.actionSheetController.create({
      header: dataItems[0],
      buttons: buttons,
    });
    await actionSheet.present();
  }

  ionViewDidEnter() {
    console.log('browse.page.ts : ionViewDidEnter()');
  }

}
