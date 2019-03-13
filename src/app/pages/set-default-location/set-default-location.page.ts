import { Component, OnInit } from '@angular/core';
import { NavController, Events } from '@ionic/angular';
import * as L from 'leaflet';
import { GpsPositionService } from 'src/app/services/gps-position/gps-position.service';
import { Coordinates } from 'src/app/interfaces/coordinates';
import { MemoryService } from 'src/app/services/memory/memory.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-set-default-location',
  templateUrl: './set-default-location.page.html',
  styleUrls: ['./set-default-location.page.scss'],
})
export class SetDefaultLocationPage implements OnInit {
  map: L.map;
  locationChanged = false;
  marker: any;
  markerAdded = false;
  selectedCoordinates: Coordinates;
  mapLoaded = false;
  lenderIcon = L.icon({
    iconUrl: '../../../assets/imgs/lender_ball_32.png',
    iconSize: [32, 32]
  });
  constructor(
    private navController: NavController,
    private gps: GpsPositionService,
    private events: Events,
    private memory: MemoryService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.events.subscribe('gps-coordinates', (coords: Coordinates) => {
      this.setLocation(coords);
    });
    this.events.subscribe('location-choosed', (lat, lon) => {
      this.setLocation({latitude: lat, longitude: lon});
    });
  }

  setLocation(coordinates: Coordinates) {
    this.locationChanged = true;
    this.selectedCoordinates = coordinates;
    this.map.setView([coordinates.latitude, coordinates.longitude]);
    if (this.markerAdded) {
      this.map.removeLayer(this.marker);
    }
    this.marker = L.marker([coordinates.latitude, coordinates.longitude], {icon: this.lenderIcon}).addTo(this.map);
    this.markerAdded = true;
  }

  ionViewDidEnter() {
    if (this.mapLoaded === false) {
      this.loadMap();
      this.mapLoaded = true;
    }
  }

  loadMap() {
    let zoomValue = 12;
    let defaultValueIsSet = false;
    let coords: Coordinates = { latitude: 60.221096, longitude: 24.807696};

    if (this.gps.locationIsAvailable) {
      coords = this.gps.getGPSCoordinates();
    }

    if (this.memory.defaultLocationIsAvailable()) {
      coords = this.memory.getDefaultLocationCoordinates();
      defaultValueIsSet = true;
    }

    this.map = L.map('map').setView([coords.latitude, coords.longitude], zoomValue);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: 'Lender',
      id: 'mapbox.streets'
    }).addTo(this.map);

    if (defaultValueIsSet) {
      this.setLocation(coords);
    }

  }

  locateByGPS() {
    this.gps.tryToFetchCurrentGPSCoordinates();
  }

  chooseLocation() {
    this.router.navigate(['choose-location/set-default-location']);
  }

  saveLocation() {
    this.memory.setDefaultLocationCoordinates(this.selectedCoordinates);
    this.goBack();
  }

  goBack() {
    this.navController.navigateBack('/my-profile');
  }
}
