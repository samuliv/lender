import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import * as L from 'leaflet';
import { GpsPositionService } from 'src/app/services/gps-position/gps-position.service';
import { Coordinates } from 'src/app/interfaces/coordinates';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-browse-map',
  templateUrl: './browse-map.page.html',
  styleUrls: ['./browse-map.page.scss'],
})
export class BrowseMapPage implements OnInit {

  map: L.map;
  constructor(
    private navController: NavController,
    private gpsPosition: GpsPositionService,
    private glb: GlobalService) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.loadMap();
  }

  loadMap() {

    const borrowableItems = this.glb.mediaItemsChaceGet();
    let zoomValue = 12;
    let coords: Coordinates = { latitude: 60.221096, longitude: 24.807696};

    if (borrowableItems.length === 1) {
      // Only one item, so now we'll use item location instead of user location
      coords.latitude = borrowableItems[0].media_data.lat;
      coords.longitude = borrowableItems[0].media_data.lon;
      zoomValue = 14;
    } else {
      // Fetch the current location based on user set location or gps
      if (this.gpsPosition.isLocationAvailable()) {
        coords = this.gpsPosition.getGPSCoordinates();
      }
    }

    this.map = L.map('map').setView([coords.latitude, coords.longitude], zoomValue);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: 'Lender',
      id: 'mapbox.streets'
    }).addTo(this.map);

    const lenderIcon = L.icon({
      iconUrl: '../../../assets/imgs/lender_ball_32.png',
      iconSize: [32, 32]
    });

    if (borrowableItems.length > 0) {
      for (let i = 0; i < borrowableItems.length; i++) {
        const popupData = `
        <img style="max-width: 80px; max-height: 120px;float:left;margin-right:10px;margin-bottom:10px;" src="${borrowableItems[i].media_data.thumb}">
        <p style="min-width:100px;"> ${borrowableItems[i].title} </p>
        <p> ${borrowableItems[i].media_data.description} </p>`;
        
        L.marker([borrowableItems[i].media_data.lat, borrowableItems[i].media_data.lon], {icon: lenderIcon}).addTo(this.map)
        .bindPopup(popupData);
      }
    }
    
  }

  borrowItem() {
    console.log('TODO');
  }

  goBack() {
    this.navController.navigateBack('/tabs/browse');
  }

}
