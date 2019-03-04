import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, Events } from '@ionic/angular';
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
  extension: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private navController: NavController,
    private openStreetMap: OpenStreetMapService,
    private gpsPositionService: GpsPositionService,
    private events: Events) {
      this.source = this.activatedRoute.snapshot.paramMap.get('source');
      this.extension = '';
      const items = this.source.split('_');
      if ( items.length > 1 ) {
        this.source = items[0];
        this.extension = items[1];
      } else {
        this.extension = '';
      }
  }

  ngOnInit() {
  }

  itemClick(item: Address) {
    console.log(item.coordinates.latitude + ', ' + item.coordinates.longitude);
    this.events.publish('location-choosed', item.coordinates.latitude, item.coordinates.longitude, item.city);
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
      case 'add-lendable-item':
        this.navController.navigateBack('/add-lendable-item/' + this.extension);
        break;
      case 'lent':
        this.navController.navigateBack('/tabs/lent');
        break;
      default:
        this.navController.navigateBack('/tabs/browse');
        break;
    }
  }


}
