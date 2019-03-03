import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Address } from 'src/app/interfaces/address';
import { OpenStreetMapService } from 'src/app/services/openstreetmap/openstreetmap.service';
import { GpsPositionService } from 'src/app/services/gps-position/gps-position.service';

@Component({
  selector: 'app-choose-location',
  templateUrl: './choose-location.page.html',
  styleUrls: ['./choose-location.page.scss'],
})
export class ChooseLocationPage implements OnInit {

  addressOptions: Address[];
  address: string;
  refreshTimer: any;

  source: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private navController: NavController,
    private openStreetMap: OpenStreetMapService,
    private gpsPositionService: GpsPositionService) {
    this.source = this.activatedRoute.snapshot.paramMap.get('source');
  }

  ngOnInit() {
  }

  itemClick(item: Address) {
    console.log(item.coordinates.latitude + ', ' + item.coordinates.longitude);
    if ( this.source === 'browse' ) {
      this.gpsPositionService.setGPSCoordinatesAndCity(
        item.coordinates.latitude,
        item.coordinates.longitude,
        item.city);
    }
    this.goBack();
  }

  triggerRefresh() {
    clearTimeout(this.refreshTimer);
    this.refreshTimer = setTimeout( () => { this.searchForAddress(); }, 250);
  }

  searchForAddress() {
    if ( this.address.length < 3 ) {
      this.addressOptions = [];
    } else {
      this.openStreetMap.searchByAddress(this.address).subscribe((res) => {
        this.addressOptions = this.openStreetMap.translateToAddress(res);
      });
    }
  }

  goBack() {
    switch ( this.source ) {
      case 'lent':
        this.navController.navigateBack('/tabs/lent');
        break;
      default:
        this.navController.navigateBack('/tabs/browse');
        break;
    }
  }


}
