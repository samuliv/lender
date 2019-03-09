import { Injectable } from '@angular/core';
import { Coordinates } from 'src/app/interfaces/coordinates';
import { Events } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx'
import { OpenStreetMapService } from '../openstreetmap/openstreetmap.service';

@Injectable({
  providedIn: 'root'
})
export class GpsPositionService {

  latitude = 0;
  longitude = 0;
  currentCity: string;
  locationIsAvailable: boolean;
  locationByGPS: boolean;

  constructor(
    private events: Events,
    private geolocation: Geolocation,
    private openStreetMap: OpenStreetMapService,
    ) {
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
    console.log('tryToFetchCurrentGPSCoordinates()');
    this.geolocation.getCurrentPosition().then((res) => {
      console.log('tryToFetchCurrentGPSCoordinates(): Success! ' + res.coords.latitude + ' ' + res.coords.longitude);
      this.latitude = res.coords.latitude;
      this.longitude = res.coords.longitude;
      this.locationByGPS = true;
      const coords: Coordinates = { latitude: res.coords.latitude, longitude: res.coords.longitude };
      this.events.publish('gps-coordinates', coords);
      this.openStreetMap.describeCoordinates(this.latitude, this.longitude).then((location) => {
        this.currentCity = location.toString();
        console.log('tryToFetchCurrentGPSCoordinates(): location = ' + location.toString());
        localStorage.setItem('CurrentLat', this.latitude.toString());
        localStorage.setItem('CurrentLon', this.longitude.toString());
        localStorage.setItem('CurrentCity', location.toString());
        this.events.publish('location-changed');
      });
    }).catch((err) => {
      console.log('Geolocation error: ' + err);
    });
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
