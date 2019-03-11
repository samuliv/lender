import { Component, OnInit } from '@angular/core';
import { ActionSheetController, Events, IonApp } from '@ionic/angular';
import { ExtraService } from '../../services/extra/extra.service';
import { Router } from '@angular/router';
import { GpsPositionService } from 'src/app/services/gps-position/gps-position.service';
import { MediaItem } from 'src/app/interfaces/mediaitem';
import { WbmaService } from 'src/app/services/wbma/wbma.service';
import { GpsDistanceService } from 'src/app/services/gps-distance/gps-distance.service';
import { OpenStreetMapService } from 'src/app/services/openstreetmap/openstreetmap.service';
import { TimeService } from 'src/app/services/time/time.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { MemoryService } from 'src/app/services/memory/memory.service';
import { LendItem } from 'src/app/interfaces/lenditem';

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
  searchText = '';
  minUserRating: number;
  currentLocationByGPS = false;

  startTime = '';
  endTime = '';

  selectedCategoryID = 0;
  selectedCategoryName = 'All';
  selectedCategoryContains: number[] = [];

  refreshTimer: any;
  browseItems = false;
  moreSearchOptions = (this.memory.memReadString('lender-serach-more-options', '0') === '1' ? true : false);
  myUserID = -1;

  borrowableItems: MediaItem[] = [];
  tempItems: MediaItem[] = [];

  constructor(
    public actionSheetController: ActionSheetController,
    public extra: ExtraService,
    private router: Router,
    private gpsPositionService: GpsPositionService,
    private gpsDistance: GpsDistanceService,
    private openStreetMap: OpenStreetMapService,
    private glb: GlobalService,
    private wbma: WbmaService,
    private time: TimeService,
    private memory: MemoryService,
    private events: Events) {
      this.maxDistance = this.memory.memReadNumber('lender-serach-max-dist', 20);
      this.useGpsLocation = (this.memory.memReadString('lender-serach-use-gps', '1') ? true : false);
      this.maxPrice = this.memory.memReadNumber('lender-serach-max-price', 20);
      this.setDateRange = false;
      this.minUserRating = 0;
      this.currentLocationName = '(none)';
      this.startTime = this.time.getLenderTimeString('now');
      this.events.subscribe('location-changed', () => {
        this.refreshLocationData();
        this.someParameterChanged();
      });

      this.events.subscribe('category-clicked-browse', (id, categroyname, contains) => {
        this.selectedCategoryID = id;
        this.selectedCategoryName = categroyname;
        this.selectedCategoryContains = contains;
        this.selectCatgory(id);
        this.someParameterChanged();
      });
  }

  selectCatgory(id: number) {
    localStorage.setItem('selected-category', id.toString());
    this.selectedCategoryID = id;
    if (id === 0) {
      this.selectedCategoryName = 'All';
    } else {
      this.selectedCategoryName = '';
      this.extra.getCategoryNameById(id).subscribe((req) => {
        if (req.success) {
          this.selectedCategoryContains = req.contains;
          this.selectedCategoryName = req.response;
        }
      });
    }
  }

  ngOnInit() {
    this.refreshLocationData();
    this.time.getLenderTimeString('now');
    if (localStorage.getItem('selected-category')) {
      console.log(localStorage.getItem('selected-category'));
      this.selectCatgory(parseInt(localStorage.getItem('selected-category'), 10));
    }
    if (this.useGpsLocation) {
      this.gpsPositionService.tryToFetchCurrentGPSCoordinates();
    }
  }

  moreSearchOptionsToggle() {
    this.moreSearchOptions = !this.moreSearchOptions;
    this.someParameterChanged();
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
      this.currentLocationByGPS = false;
    } else {
      this.currentLocationByGPS = true;
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

  viewUserProfile(item: LendItem) {
    this.router.navigate(['/view-user-profile/' + item.user_id + '_' + 'browse']);
  }

  viewMedia(media_id: number) {
    this.router.navigate(['/view-media/' + media_id.toString()]);
  }

  viewMap() {
    this.glb.mediaItemsChaceSet(this.borrowableItems);
    this.router.navigate(['/browse-map']);
  }
  
  viewItemOnMap(item: MediaItem) {
    console.log('TODO');
  }

  gpsLocationClick() {
    if (this.useGpsLocation) {
      this.gpsPositionService.tryToFetchCurrentGPSCoordinates();
    }
    this.someParameterChanged();
  }

  someParameterChanged() {
    if (this.startTime !== ''){
      if (this.endTime === '' || this.time.calculateTimeDifference(this.startTime, this.endTime) === -1 ) {
        this.endTime = this.time.getTimeAfter(this.startTime, 3600);
      }
      localStorage.setItem('lender-serach-max-dist', this.maxDistance.toString());
      localStorage.setItem('lender-serach-max-price', this.maxPrice.toString());
      localStorage.setItem('lender-serach-min-rating', this.minUserRating.toString());
      localStorage.setItem('lender-serach-more-options', (this.moreSearchOptions === true ? '1' : '0'));
      localStorage.setItem('lender-serach-text', this.searchText);
      localStorage.setItem('lender-serach-use-gps-location', (this.useGpsLocation === true ? '1' : '0'));
    }
    clearTimeout(this.refreshTimer);
    this.refreshTimer = setTimeout( () => {
      this.refreshBrowseItems();
    }, 250);
  }

  requestLendNow(item: MediaItem) {
    if (item.user_id === this.wbma.getMyUserID()) {
      console.log('Cannot lend own items.');
    } else {
      this.router.navigate(['/request-item/' + item.file_id.toString() + '_' + this.startTime + '_' + this.endTime]);
    }
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

  refreshBrowseItems() {
    this.borrowableItems = [];
    this.wbma.getAllMediaByAppTagAsMediaItem().subscribe((res) => {
      this.tempItems = this.wbma.readMediaData(res);
      this.applyFiltering(this.tempItems);
      if (this.tempItems.length > 0) {
        for (let i = 0; i < this.tempItems.length; i++) {
          this.extra.availabilityCheck(
            this.tempItems[i],
            (this.startTime === '' || this.endTime === '' ? '1.1.1987 00:00:00' : this.startTime),
            (this.startTime === '' || this.endTime === '' ? '1.1.1987 00:00:01' : this.endTime)
            ).subscribe((avlbl) => {
            if (avlbl.available) {
              let showItem = true;
              if (this.moreSearchOptions && (this.minUserRating > avlbl.feedback)) {
                // this user does not have required amount of star score
                showItem = false;
              }
              if (showItem) {
                this.tempItems[i].user_score = avlbl.feedback;
                this.tempItems[i].user_feedback_negative = avlbl.feedback_negative;
                this.tempItems[i].user_feedback_positive = avlbl.feedback_positive;
                this.borrowableItems.push(this.tempItems[i]);
                this.wbma.getUserInformation(this.tempItems[i].user_id).subscribe((user) => {
                  this.tempItems[i].user_name = user.username;
                })
                this.openStreetMap.describeCoordinates(this.tempItems[i].media_data.lat, this.tempItems[i].media_data.lon).then((location: string) => {
                  this.tempItems[i].location = location;
                })
              }
            }
          });
        }
      }
    });
  }

  quickSearchAction(args: string[]) {
    this.selectedCategoryID = parseInt(args[0], 10);
    this.selectedCategoryName = '';
    this.maxPrice = parseInt(args[1], 10);
    this.maxDistance = parseInt(args[2], 10);
    this.startTime = this.time.getLenderTimeString(args[3]);
    this.searchText = '';
    console.log(this.startTime);
    this.endTime = this.time.getTimeAfter(this.startTime, parseInt(args[4], 10) * 3600);
      this.extra.getCategoryNameById(this.selectedCategoryID).subscribe((res) => {
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
                   How much it can cost per hour?; Nothing: 0; max 1 € /hour: 1; max 5 € /hour: 5; max 10 € /hour: 10; max 50 € /hour: 50; No limit: 201
                   How near it has to be located?; 2 km or less : 2; 5 km or less : 5; 20 km or less : 20; No limit: 201
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
    this.myUserID = this.wbma.getMyUserID();
  }

}
