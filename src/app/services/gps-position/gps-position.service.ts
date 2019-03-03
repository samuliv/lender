import { Injectable } from '@angular/core';
import { Coordinates } from 'src/app/interfaces/coordinates';
import { Events } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class GpsPositionService {

  latitude = 0;
  longitude = 0;
  currentCity: string;
  locationIsAvailable: boolean;
  locationByGPS: boolean;

  constructor(public events: Events) {
    this.latitude = 0;
    this.longitude = 0;
    this.currentCity = '(none)';
    this.locationIsAvailable = false;
    this.locationByGPS = false;
    if ( localStorage.getItem('CurrentLat') != null
          && localStorage.getItem('CurrentLon') != null
          && localStorage.getItem('CurrentCity') != null ) {
      this.latitude = parseFloat(localStorage.getItem('CurrentLat'));
      this.longitude = parseFloat(localStorage.getItem('CurrentLon'));
      this.currentCity = localStorage.getItem('CurrentCity');
      this.locationIsAvailable = true;
    }
  }

  tryToFetchCurrentGPSCoordinates() {
    // TODO
    console.log('***TRY TO FETCH CURRENT GPS COORDINATES***');
    console.log('*** TO DO ***');
  }

  setGPSCoordinatesAndCity(latitude: number, longitude: number, city: string) {
    localStorage.setItem('CurrentLat', latitude.toString());
    localStorage.setItem('CurrentLon', longitude.toString());
    localStorage.setItem('CurrentCity', city);
    this.locationByGPS = false;
    this.latitude = latitude;
    this.longitude = longitude;
    this.currentCity = city;
    this.locationIsAvailable = true;
    this.events.publish('location-changed');
  }

  getIsLocationByGPS(): boolean {
    return this.locationByGPS;
  }

  getGPSCoordinates(): Coordinates {
    return {latitude: this.latitude, longitude: this.longitude};
  }

  getCurrentLocationName(): string {
    return this.currentCity;
  }

  isLocationAvailable(): boolean {
    return this.locationIsAvailable;
  }
}
